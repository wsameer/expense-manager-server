import User from '#models/user'
import Account from '#models/account'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AccountPolicy extends BasePolicy {
  constructor(protected ctx: HttpContext) {
    super()
  }

  /**
   * Every logged-in user can create an account
   */
  create(): AuthorizerResponse {
    return true
  }

  /**
   * Only the account creator can view the account
   */
  view(user: User, account: Account): AuthorizerResponse {
    return user.id === account.userId
  }

  /**
   * Only the account creator can edit the account
   */
  update(user: User, account: Account): AuthorizerResponse {
    return user.id === account.userId
  }

  /**
   * Only the account creator can delete the account
   */
  delete(user: User, account: Account): AuthorizerResponse {
    return user.id === account.userId
  }

  deleteAll(): AuthorizerResponse {
    return true
  }
}
