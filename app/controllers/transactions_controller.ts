import Account from '#models/account'
import Transaction from '#models/transaction'
import { createTransactionValidator } from '#validators/transaction'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { TransactionType } from '../types/transactions.js'

export default class TransactionsController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()

    const transactions = await Transaction.query()
      .where('userId', user.id)
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
      date: DateTime.fromISO(validatedData.date.toISOString()),
      note: validatedData.note ?? '',
    })

    const trx = await db.transaction()

    try {
      switch (validatedData.type) {
        case 'bank_to_bank':
          await Account.query({ client: trx })
            .where('id', validatedData.from_account_id)
            .decrement('balance', validatedData.amount)

          await Account.query({ client: trx })
            .where('id', validatedData.to_account_id!)
            .increment('balance', validatedData.amount)
          break

        case 'expense':
          await Account.query({ client: trx })
            .where('id', validatedData.from_account_id)
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

  async show({ params }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
