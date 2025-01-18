import User from '#models/user'
import ExpenseCategory from '#models/expense_category'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ExpenseCategoryPolicy extends BasePolicy {
  /**
   * Every logged-in user can create an expense category
   */
  create(): AuthorizerResponse {
    return true
  }

  /**
   * Only the expense category creator can view it
   */
  view(user: User, expenseCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === expenseCategory.userId
  }

  /**
   * Only the expense category creator can edit it
   */
  update(user: User, expenseCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === expenseCategory.userId
  }

  /**
   * Only the expense category creator can delete it
   */
  delete(user: User, expenseCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === expenseCategory.userId
  }
}
