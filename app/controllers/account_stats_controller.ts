import type { HttpContext } from '@adonisjs/core/http'
import { accountStatsValidator } from '#validators/account_stat'
import { AccountsStatService } from '#services/accounts_stat_service'
import { inject } from '@adonisjs/core'

@inject()
export default class AccountStatsController {
  constructor(private accountsStatService: AccountsStatService) {}

  async index({ auth, request }: HttpContext) {
    await auth.authenticate()
    const validatedData = await request.validateUsing(accountStatsValidator)

    const totalBalance = await this.accountsStatService.calculateBalance(validatedData.type)

    return {
      stat_type: validatedData.type,
      total_balance: totalBalance,
    }
  }
}
