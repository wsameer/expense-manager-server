import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

import { createAccountValidator } from '#validators/account'
import Account from '#models/account'
import { AccountType } from '../types/accounts.js'

export default class AccountsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const accounts = await Account.query().where('userId', user.id).orderBy('createdAt', 'desc')

      return response.ok(accounts)
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED') {
        return response.unauthorized({
          errors: [{ message: 'Please login to access this resource' }],
        })
      }

      return response.internalServerError({
        errors: [{ message: 'An error occurred while fetching accounts' }],
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ bouncer, auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if (await bouncer.with('AccountPolicy').denies('create')) {
      return response.forbidden({
        error: [{ message: 'You cannot create an account' }],
      })
    }

    try {
      const validatedData = await request.validateUsing(createAccountValidator)

      if (validatedData.group === AccountType[2] && validatedData.payment_account_id === null) {
        return response.badRequest({
          error: [{ message: 'Credit card accounts must have a payment account.' }],
        })
      }

      const account = await Account.create({
        name: validatedData.name,
        userId: user.id,
        group: validatedData.group,
        balance: validatedData.balance,
        paymentAccountId: validatedData.payment_account_id,
        description: validatedData.description ?? '',
      })

      return response.ok(account.toJSON())
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({
          errors: error.messages,
        })
      }

      // Handle unexpected errors
      return response.internalServerError({
        errors: [{ message: 'Something went wrong' }],
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer, auth, response }: HttpContext) {
    await auth.authenticate()

    const account = await Account.findOrFail(params.id)

    if (await bouncer.with('AccountPolicy').denies('view', account)) {
      return response.forbidden({
        errors: [{ message: 'You cannot view this account' }],
      })
    }

    return response.ok(account.toJSON())
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, auth, bouncer, request, response }: HttpContext) {
    await auth.authenticate()

    const account = await Account.findOrFail(params.id)

    // Check if the user has permission to update this account
    await bouncer.with('AccountPolicy').authorize('update', account)

    try {
      const validatedData = await request.validateUsing(createAccountValidator)

      if (validatedData.group === AccountType[2] && !validatedData.payment_account_id) {
        return response.unprocessableEntity({
          errors: [{ message: 'Credit card accounts must have a payment account.' }],
        })
      }

      // Update the account with validated data
      account.merge(validatedData)
      await account.save()

      return response.ok(account.toJSON())
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.unprocessableEntity({
          errors: error.messages,
        })
      }

      // Handle unexpected errors
      return response.internalServerError({
        errors: [{ message: 'An unexpected error occurred while updating the account.' }],
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, auth, bouncer, response }: HttpContext) {
    await auth.authenticate()

    const account = await Account.findByOrFail(params.id)

    if (await bouncer.with('AccountPolicy').denies('delete', account)) {
      return response.forbidden({
        errors: [{ message: 'You cannot delete this account' }],
      })
    }

    await account.delete()

    return response.ok({
      success: true,
    })
  }
}
