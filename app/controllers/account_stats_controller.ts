import type { HttpContext } from '@adonisjs/core/http'
import { accountStatsValidator } from '#validators/account_stat'
import { AccountsStatService } from '#services/accounts_stat_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class AccountStatsController {
  constructor(private accountsStatService: AccountsStatService) {}

  async index({ auth, request, response }: HttpContext) {
    try {
      await auth.authenticate()
      const validatedData = await request.validateUsing(accountStatsValidator)

      const totalBalance = await this.accountsStatService.calculateBalance(validatedData.type)

      return response.ok({
        success: true,
        data: {
          stat_type: validatedData.type,
          total_balance: totalBalance,
        },
      })
    } catch (error) {
      return this.handleError(error, response)
    }
  }

  private handleError(error: any, response: HttpContext['response']) {
    if (error.code === 'E_UNAUTHORIZED') {
      return response.unauthorized({
        success: false,
        message: 'Please login to access this resource',
      })
    }

    if (error.code === 'E_VALIDATION_FAILURE') {
      return response.badRequest({
        success: false,
        message: 'Invalid input parameters',
        errors: error.messages,
      })
    }

    logger.error('Account stats error:', error)
    return response.internalServerError({
      success: false,
      message: 'An error occurred while fetching account stats',
    })
  }
}
