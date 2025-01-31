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

  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  view(user: User, transaction: Transaction): AuthorizerResponse {
    return user.id === transaction.userId
  }

  update(user: User, transaction: Transaction): AuthorizerResponse {
    return user.id === transaction.userId
  }

  delete(user: User, transaction: Transaction): AuthorizerResponse {
    return user.id === transaction.userId
  }

  deleteAll(): AuthorizerResponse {
    return true
  }
}
