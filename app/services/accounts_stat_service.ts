import { inject } from '@adonisjs/core'
import { AccountStatsType, AccountStatsTypeEnum, AccountType } from '../types/accounts.js'
import Account from '#models/account'
import db from '@adonisjs/lucid/services/db'

@inject()
export class AccountsStatService {
  async calculateBalance(type: AccountStatsTypeEnum, userId: number): Promise<number> {
    switch (type) {
      case AccountStatsType[0]: // assets
        return this.calculateAssetsBalance(userId)

      case AccountStatsType[1]: // debts
        return this.calculateDebtsBalance(userId)

      case AccountStatsType[2]: // total
        return this.calculateNetBalance(userId)

      default:
        return 0
    }
  }

  private async calculateAssetsBalance(userId: number) {
    const result = await Account.query()
      .where('user_id', userId)
      .whereNot('group', AccountType[2])
      .sum('balance as total')
      .firstOrFail()

    return Number(result?.$extras.total) || 0
  }

  private async calculateDebtsBalance(userId: number) {
    const result = await Account.query()
      .where('user_id', userId)
      .where('group', AccountType[2])
      .sum('balance as total')
      .firstOrFail()

    return Number(result?.$extras.total) || 0
  }

  private async calculateNetBalance(userId: number) {
    const result = await Account.query()
      .where('user_id', userId)
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
