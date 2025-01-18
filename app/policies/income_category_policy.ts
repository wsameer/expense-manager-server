import User from '#models/user'
import IncomeCategory from '#models/income_category'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class IncomeCategoryPolicy extends BasePolicy {
  /**
   * Every logged-in user can create an income category
   */
  create(): AuthorizerResponse {
    return true
  }

  view(user: User, incomeCategory: IncomeCategory): AuthorizerResponse {
    return user.id === incomeCategory.userId
  }

  update(user: User, incomeCategory: IncomeCategory): AuthorizerResponse {
    return user.id === incomeCategory.userId
  }

  delete(user: User, incomeCategory: IncomeCategory): AuthorizerResponse {
    return user.id === incomeCategory.userId
  }
}
