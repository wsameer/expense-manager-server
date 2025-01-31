import type UserRegistered from '#events/user_registered'
import ExpenseCategory from '#models/expense_category'
import { Exception } from '@adonisjs/core/exceptions'
import logger from '@adonisjs/core/services/logger'

class ExpenseCategoryCreationException extends Exception {
  static status = 500
}

export default class CreateExpenseCategories {
  async handle(event: UserRegistered) {
    const defaultCategories = [
      'Food',
      'Groceries',
      'Utilities',
      'Shopping',
      'Health',
      'House',
      'Transport',
      'Travel',
      'Other',
    ]

    const dataToInsert = defaultCategories.map((categoryName) => {
      return {
        userId: event.user.id,
        name: categoryName,
        isDefault: true,
      }
    })

    try {
      await ExpenseCategory.createMany(dataToInsert)
      logger.log(
        'info',
        `[CreateExpenseCategories] Created expense categories for user ${event.user.email}`
      )
    } catch (error) {
      throw new ExpenseCategoryCreationException('Failed to create expense categories', {
        cause: error,
      })
    }
  }
}
