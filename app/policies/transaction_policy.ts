import User from '#models/user'
import Transaction from '#models/transaction'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TransactionPolicy extends BasePolicy {
  constructor(protected ctx: HttpContext) {
    super()
  }

  /**
   * Every logged-in user can create a transaction
   */
  create(): AuthorizerResponse {
    return true
  }

  /**
   * Only the transaction creator can view the transaction
   */
  view(user: User, transaction: Transaction): AuthorizerResponse {
    return user.id === transaction.userId
  }

  /**
   * Only the transaction creator can edit the transaction
   */
  update(user: User, transaction: Transaction): AuthorizerResponse {
    return user.id === transaction.userId
  }

  /**
   * Only the transaction creator can delete the transaction
   */
  delete(user: User, transaction: Transaction): AuthorizerResponse {
    return user.id === transaction.userId
  }

  deleteAll(): AuthorizerResponse {
    return true
  }
}
