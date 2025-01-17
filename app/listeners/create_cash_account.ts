import Account from '#models/account'
import { AccountType } from '../types/accounts.js'
import { Exception } from '@adonisjs/core/exceptions'
import UserRegistered from '#events/user_registered'

class CashAccountCreationException extends Exception {
  static status = 500
}

export default class CreateCashAccount {
  async handle(userRegistered: UserRegistered) {
    try {
      await Account.create({
        name: 'Cash',
        userId: userRegistered.user.id,
        group: AccountType[0],
        balance: 0.0,
        paymentAccountId: null,
        description: 'Everyone start with a cash account',
      })
    } catch (error) {
      console.log(error)
      throw new CashAccountCreationException('Failed to create cash account', { cause: error })
    }
  }
}
