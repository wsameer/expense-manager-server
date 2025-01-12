import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { createAccountValidator } from '#validators/account'
import Account from '#models/account'

export default class AccountsController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const accounts = await Account.query().where('userId', user.id).orderBy('createdAt', 'desc')

      return response.ok({
        success: true,
        data: accounts,
      })
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED') {
        return response.unauthorized({
          success: false,
          message: 'Please login to access this resource',
        })
      }

      logger.error('AccountsController.index error:', error)

      return response.internalServerError({
        success: false,
        message: 'An error occurred while fetching accounts',
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
        success: false,
        error: 'You cannot create an account',
      })
    }

    try {
      const validatedData = await request.validateUsing(createAccountValidator)

      if (validatedData.group === 'CREDIT_CARD' && validatedData.paymentAccountId === null) {
        return response.badRequest({
          success: false,
          error: 'Credit card accounts must have a payment account.',
        })
      }

      const account = await Account.create({
        name: validatedData.name,
        userId: user.id,
        group: validatedData.group,
        balance: validatedData.balance,
        paymentAccountId: validatedData.paymentAccountId,
        description: validatedData.description ?? '',
      })

      return response.ok({
        success: true,
        data: account,
      })
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({
          status: 'error',
          errors: error.messages,
          message: 'Validation failed',
        })
      }

      // Handle unexpected errors
      return response.internalServerError({
        status: 'error',
        message: 'Something went wrong',
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
