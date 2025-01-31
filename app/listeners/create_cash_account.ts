import { Exception } from '@adonisjs/core/exceptions'

import Account from '#models/account'
import type UserRegistered from '#events/user_registered'
import { AccountType } from '../types/accounts.js'
import logger from '@adonisjs/core/services/logger'

class CashAccountCreationException extends Exception {
  static status = 500
}

export default class CreateCashAccount {
  async handle(event: UserRegistered) {
    try {
      await Account.create({
        name: 'Cash',
        userId: event.user.id,
        group: AccountType[0],
        balance: 0.0,
        paymentAccountId: null,
        description: 'Everyone start with a cash account',
      })
      logger.log('info', `[CreateCashAccount] Created cash account for user ${event.user.email}`)
    } catch (error) {
      console.log(error)
      throw new CashAccountCreationException('Failed to create cash account', { cause: error })
    }
  }
}
