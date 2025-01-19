import User from '#models/user'
import ExpenseSubcategory from '#models/expense_subcategory'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class ExpenseSubcategoryPolicy extends BasePolicy {
  create(user: User): AuthorizerResponse {
    return user.id !== null
  }

  async view(user: User, expenseSubcategory: ExpenseSubcategory): Promise<AuthorizerResponse> {
    await expenseSubcategory.load('expenseCategory')
    return user.id === expenseSubcategory.expenseCategory.userId
  }

  async delete(user: User, subCategory: ExpenseSubcategory): Promise<AuthorizerResponse> {
    await subCategory.load('expenseCategory')
    return user.id === subCategory.expenseCategory.userId
  }
}
