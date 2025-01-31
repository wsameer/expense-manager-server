import { errors as vineErrors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

import { createAccountValidator } from '#validators/account'
import Account from '#models/account'
import { AccountType } from '../types/accounts.js'
import { ForbiddenException } from '#exceptions/forbidden_exception'

export default class AccountsController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()

    const accounts = await Account.query().where('userId', user.id).orderBy('updatedAt', 'desc')

    return accounts
  }

  /**
   * Create a new account
   * @returns newly create account details
   */
  async store({ bouncer, auth, request }: HttpContext) {
    const user = await auth.authenticate()

    if (await bouncer.with('AccountPolicy').denies('create')) {
      throw new ForbiddenException('Insufficient permissions to create an account')
    }

    const validatedData = await request.validateUsing(createAccountValidator)

    if (validatedData.group === AccountType[2] && validatedData.payment_account_id === null) {
      throw new vineErrors.E_VALIDATION_ERROR([
        {
          field: 'payment_account_id',
          message: 'Credit card accounts must have a payment account.',
        },
      ])
    }

    const account = await Account.create({
      ...validatedData,
      userId: user.id,
    })

    return account
  }

  /**
   * Get account details by id
   * @param param account id
   * @returns fetched account details
   */
  async show({ params, bouncer, auth }: HttpContext) {
    await auth.authenticate()

    const account = await Account.findOrFail(params.id)

    if (await bouncer.with('AccountPolicy').denies('view', account)) {
      throw new ForbiddenException('You cannot view this account')
    }

    return account
  }

  /**
   * PUT
   * Update existing account
   */
  async update({ params, auth, bouncer, request }: HttpContext) {
    await auth.authenticate()

    const account = await Account.findOrFail(params.id)
    await bouncer.with('AccountPolicy').authorize('update', account)

    const validatedData = await request.validateUsing(createAccountValidator)

    if (validatedData.group === AccountType[2] && !validatedData.payment_account_id) {
      throw new vineErrors.E_VALIDATION_ERROR([
        {
          field: 'payment_account_id',
          message: 'Credit card accounts must have a payment account.',
        },
      ])
    }

    await account.merge(validatedData).save()
    return account
  }

  /**
   * DELETE an account
   */
  async destroy({ params, auth, bouncer }: HttpContext) {
    await auth.authenticate()

    const account = await Account.findByOrFail({ id: params.id })

    if (await bouncer.with('AccountPolicy').denies('delete', account)) {
      throw new ForbiddenException('You cannot delete this account')
    }

    await account.delete()

    return { success: true }
  }
}
