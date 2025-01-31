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

  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  view(user: User, account: Account): AuthorizerResponse {
    return user.id === account.userId
  }

  update(user: User, account: Account): AuthorizerResponse {
    return user.id === account.userId
  }

  delete(user: User, account: Account): AuthorizerResponse {
    return user.id === account.userId
  }

  deleteAll(user: User): AuthorizerResponse {
    return user.id !== null
  }
}
