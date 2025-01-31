import { DateTime } from 'luxon'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

import { idValidator } from '#validators/route_id'
import Account from '#models/account'
import Transaction from '#models/transaction'
import {
  createTransactionValidator,
  dateValidator,
  updateTransactionValidator,
} from '#validators/transaction'
import { TransactionType } from '../types/transactions.js'
import { TransactionService } from '#services/transaction_service'

@inject()
export default class TransactionsController {
  constructor(protected transactionService: TransactionService) {}

  async index({ auth, request }: HttpContext) {
    const user = await auth.authenticate()
    const [year, month] = request.qs().month.split('-').map(Number)

    await dateValidator.validate({ year, month })

    const transactions = await Transaction.query()
      .where('userId', user.id)
      .apply((scopes) => scopes.byMonth(year, month))
      .preload('fromAccount')
      .preload('toAccount')
      .preload('expenseCategory')
      .preload('expenseSubcategory')
      .preload('incomeCategory')
      .orderBy('updatedAt', 'desc')

    return transactions
  }

  async store({ auth, bouncer, request }: HttpContext) {
    const user = await auth.authenticate()

    const validatedData = await request.validateUsing(createTransactionValidator)

    await bouncer.with('TransactionPolicy').allows('create')

    const transaction = await Transaction.create({
      ...validatedData,
      userId: user.id,
      type: validatedData.type as unknown as typeof TransactionType,
      date: DateTime.fromISO(validatedData.date),
      note: validatedData.note ?? '',
    })

    const trx = await db.transaction()

    try {
      switch (validatedData.type) {
        case 'bank_to_bank':
          await Account.query({ client: trx })
            .where('id', validatedData.from_account_id!)
            .decrement('balance', validatedData.amount)

          await Account.query({ client: trx })
            .where('id', validatedData.to_account_id!)
            .increment('balance', validatedData.amount)
          break

        case 'expense':
          await Account.query({ client: trx })
            .where('id', validatedData.from_account_id!)
            .decrement('balance', validatedData.amount)
          break

        case 'income':
          await Account.query({ client: trx })
            .where('id', validatedData.to_account_id!)
            .increment('balance', validatedData.amount)
          break

        default:
          break
      }
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }

    return transaction
  }

  /**
   * Get details of a transaction
   * @param param0 id of the transaction
   */
  async show({ auth, bouncer, request, params }: HttpContext) {
    await auth.authenticate()

    const validatedData = await request.validateUsing(idValidator('transactions'), {
      data: params,
    })

    const transaction = await Transaction.findOrFail(validatedData.id)

    transaction.load((loader) => {
      loader.load('fromAccount')
      loader.load('toAccount')
      loader.load('expenseCategory')
      loader.load('expenseSubcategory')
      loader.load('incomeCategory')
    })

    await bouncer.with('TransactionPolicy').allows('view', transaction)

    return transaction
  }

  async update({ auth, bouncer, params, request }: HttpContext) {
    await auth.authenticate()

    const validatedData = await updateTransactionValidator.validate({
      ...params,
      ...request.all(),
    })

    const transaction = await Transaction.findOrFail(params.id)

    await bouncer.with('TransactionPolicy').authorize('update', transaction)

    // Perform update within transaction
    await db.transaction(async (trx) => {
      // Use transaction client for all queries
      transaction.useTransaction(trx)

      const oldAmount = transaction.amount
      const newAmount = validatedData.amount ?? oldAmount

      await Transaction.query({ client: trx }).preload('fromAccount')

      if (transaction.type.toString() === TransactionType.BANK_TO_BANK) {
        await Transaction.query({ client: trx }).preload('toAccount')
      }

      if (oldAmount !== newAmount) {
        await this.transactionService.updateTransactionBalance(transaction, oldAmount, newAmount)
      }

      await transaction
        .merge({
          ...validatedData,
          date: DateTime.fromISO(validatedData.date),
          type: validatedData.type as unknown as typeof TransactionType,
          note: validatedData.note ?? '',
        })
        .save()
    })

    // Load fresh data after transaction
    await transaction.refresh()
    return validatedData
  }

  /**
   * Delete a transaction
   */
  async destroy({ auth, bouncer, params, request }: HttpContext) {
    await auth.authenticate()

    const validatedData = await request.validateUsing(idValidator('transactions'), {
      data: params,
    })

    const transaction = await Transaction.findOrFail(validatedData.id)

    await bouncer.with('TransactionPolicy').allows('delete', transaction)

    await transaction.delete()

    return { success: true }
  }

  async destroyAll({ auth }: HttpContext) {
    const user = await auth.authenticate()

    const trx = await db.transaction()

    await Transaction.query({ client: trx }).where('userId', user.id).delete()

    await Account.query({ client: trx }).where('userId', user.id).update({ balance: 0 }).exec()

    await trx.commit()

    return { success: true }
  }
}
