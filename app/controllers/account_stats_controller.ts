import { AccountsStatService } from '#services/accounts_stat_service'
import { accountStatsValidator } from '#validators/account_stat'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AccountStatsController {
  constructor(private accountsStatService: AccountsStatService) {}

  async index({ auth, request }: HttpContext) {
    const user = await auth.authenticate()
    const validatedData = await request.validateUsing(accountStatsValidator)

    const totalBalance = await this.accountsStatService.calculateBalance(
      validatedData.type,
      user.id
    )
    return {
      stat_type: validatedData.type,
      total_balance: totalBalance,
    }
  }
}
