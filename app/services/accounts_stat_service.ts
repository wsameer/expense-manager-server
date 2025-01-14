import { inject } from '@adonisjs/core'
import { AccountStatsType, AccountStatsTypeEnum, AccountType } from '../types/accounts.js'
import Account from '#models/account'
import db from '@adonisjs/lucid/services/db'

@inject()
export class AccountsStatService {
  async calculateBalance(type: AccountStatsTypeEnum): Promise<number> {
    switch (type) {
      case AccountStatsType[0]: // assets
        return this.calculateAssetsBalance()

      case AccountStatsType[1]: // debts
        return this.calculateDebtsBalance()

      case AccountStatsType[2]: // total
        return this.calculateNetBalance()

      default:
        return 0
    }
  }

  private async calculateAssetsBalance() {
    const result = await Account.query()
      .whereNot('group', AccountType[2])
      .sum('balance as total')
      .firstOrFail()

    return Number(result?.$extras.total) || 0
  }

  private async calculateDebtsBalance() {
    const result = await Account.query()
      .where('group', AccountType[2])
      .sum('balance as total')
      .firstOrFail()

    return Number(result?.$extras.total) || 0
  }

  private async calculateNetBalance() {
    const result = await Account.query()
      .select(
        db.raw(
          `
          COALESCE(SUM(CASE 
            WHEN "group" != ? THEN balance 
            ELSE 0 
          END), 0) - COALESCE(SUM(CASE 
            WHEN "group" = ? THEN balance 
            ELSE 0 
          END), 0) AS total
        `,
          [AccountType[2], AccountType[2]]
        )
      )
      .first()

    return Number(result?.$extras.total) || 0
  }
}
