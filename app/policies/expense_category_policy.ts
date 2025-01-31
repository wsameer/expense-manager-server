import User from '#models/user'
import ExpenseCategory from '#models/expense_category'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ExpenseCategoryPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  view(user: User, expenseCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === expenseCategory.userId
  }

  update(
    user: User,
    expenseCategory: {
      userId?: number | undefined
      isDefault?: boolean | undefined
      name: string
    }
  ): AuthorizerResponse {
    return user.id === expenseCategory.userId
  }

  delete(user: User, expenseCategory: ExpenseCategory): AuthorizerResponse {
    return user.id === expenseCategory.userId
  }
}
