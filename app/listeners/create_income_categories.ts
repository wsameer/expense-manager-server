import type UserRegistered from '#events/user_registered'
import IncomeCategory from '#models/income_category'
import { Exception } from '@adonisjs/core/exceptions'
import logger from '@adonisjs/core/services/logger'

class IncomeCategoryCreationException extends Exception {
  static status = 500
}

export default class CreateIncomeCategories {
  async handle(event: UserRegistered) {
    const defaultCategories = [
      'Salary',
      'Freelance',
      'Investments',
      'Side Hustle',
      'Rental Income',
      'Bank Interest',
      'Refund',
    ]

    const dataToInsert = defaultCategories.map((categoryName, index) => {
      return {
        userId: event.user.id,
        name: categoryName,
        order: index + 1,
      }
    })

    try {
      await IncomeCategory.createMany(dataToInsert)
      logger.log(
        'info',
        `[CreateIncomeCategories] Created income categories for user ${event.user.email}`
      )
    } catch (error) {
      throw new IncomeCategoryCreationException('Failed to create income categories', {
        cause: error,
      })
    }
  }
}
