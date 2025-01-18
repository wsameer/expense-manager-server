import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors } from '@vinejs/vine'

import ExpenseCategory from '#models/expense_category'
import { createExpenseCategoryValidator } from '#validators/expense_category'

export default class ExpenseCategoriesController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    try {
      const categories = await ExpenseCategory.findManyBy({ userId: user.id })

      return response.ok(categories)
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED') {
        return response.unauthorized({
          errors: [{ message: 'Please login to access this resource' }],
        })
      }

      return response.internalServerError({
        errors: [{ message: 'An error occurred while fetching expense categories' }],
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ auth, bouncer, request, response }: HttpContext) {
    const user = await auth.authenticate()

    try {
      if (await bouncer.with('ExpenseCategoryPolicy').denies('create')) {
        throw new Error('You are not allowed to created a category')
      }

      const validatedData = await createExpenseCategoryValidator.validate({
        ...request.all(),
        userId: user.id,
      })

      const category = await ExpenseCategory.create({
        userId: validatedData.userId,
        name: validatedData.name,
        isDefault: validatedData.isDefault ?? false,
      })

      return response.ok(category)
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({
          errors: error.messages,
        })
      }

      return response.internalServerError({
        errors: [{ message: 'Something went wrong' }],
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ bouncer, auth, params, response }: HttpContext) {
    await auth.authenticate()

    const category = await ExpenseCategory.findByOrFail(params)

    if (await bouncer.with('ExpenseCategoryPolicy').denies('delete', category)) {
      return response.forbidden({
        errors: [{ message: 'You cannot view this account' }],
      })
    }

    await category.delete()

    return response.ok({
      success: true,
    })
  }
}
