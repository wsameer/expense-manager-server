import User from '#models/user'
import IncomeCategory from '#models/income_category'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class IncomeCategoryPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
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
