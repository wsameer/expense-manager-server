import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import ExpenseCategory from '#models/expense_category'

export default class ExpenseSubcategoryPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  view(user: User, parentCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === parentCategory.userId
  }

  update(user: User, parentCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === parentCategory.userId
  }

  delete(user: User, parentCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === parentCategory.userId
  }
}
