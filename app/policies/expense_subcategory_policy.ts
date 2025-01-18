import User from '#models/user'
import ExpenseSubcategory from '#models/expense_subcategory'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ExpenseSubcategoryPolicy extends BasePolicy {
  async view(user: User, expenseSubcategory: ExpenseSubcategory): Promise<AuthorizerResponse> {
    await expenseSubcategory.load('expenseCategory')
    return user.id === expenseSubcategory.expenseCategory.userId
  }

  create(user: User): AuthorizerResponse {
    return true
  }
}
