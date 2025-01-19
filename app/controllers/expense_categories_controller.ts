import type { HttpContext } from '@adonisjs/core/http'

import ExpenseCategory from '#models/expense_category'
import {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
} from '#validators/expense_category'
import { ForbiddenException } from '#exceptions/forbidden_exception.ts'
import logger from '@adonisjs/core/services/logger'
import { errors } from '@vinejs/vine'

export default class ExpenseCategoriesController {
  /**
   * GET all categories and subcategories for a user
   * @returns category object
   */
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()
    const categories = await ExpenseCategory.query()
      .where('userId', user.id)
      .preload('expenseSubcategories')
      .orderBy('updatedAt', 'desc')
    return categories
  }

  /**
   * Create a new Expense Category
   * @returns newly created category details
   */
  async store({ auth, bouncer, request }: HttpContext) {
    const user = await auth.authenticate()

    if (await bouncer.with('ExpenseCategoryPolicy').denies('create')) {
      throw new ForbiddenException('You are not allowed to created a category')
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

    return category
  }

  /**
   * Get expense category by id
   * @param param0 id of the category to get
   * @returns category details along with all its subcategories
   */
  async show({ params, bouncer, auth }: HttpContext) {
    await auth.authenticate()

    const category = await ExpenseCategory.query()
      .where('id', params.id)
      .preload('expenseSubcategories')
      .firstOrFail()

    if (await bouncer.with('ExpenseCategoryPolicy').denies('view', category)) {
      throw new ForbiddenException('You are not allowed to view this expense category')
    }

    return category
  }

  /**
   * Update an expense category
   * @param param0 id of the category to update
   * @returns update category details
   */
  async update({ auth, bouncer, params, request }: HttpContext) {
    await auth.authenticate()

    const validatedData = await updateExpenseCategoryValidator.validate({
      ...params,
      ...request.all(),
    })

    const category = await ExpenseCategory.findByOrFail(params)

    if (await bouncer.with('ExpenseCategoryPolicy').denies('update', category)) {
      throw new ForbiddenException('You are not authorized to update this category')
    }

    category.name = validatedData.name

    await category.save()

    return category
  }

  /**
   * Delete an expense category
   */
  async destroy({ bouncer, auth, params }: HttpContext) {
    await auth.authenticate()

    // validation
    if (!params.id || Number.isNaN(params.id)) {
      throw new errors.E_VALIDATION_ERROR('Category Id is required or invalid')
    }

    const category = await ExpenseCategory.findByOrFail(params)

    if (await bouncer.with('ExpenseCategoryPolicy').denies('delete', category)) {
      throw new ForbiddenException('You are not authorized to delete this category')
    }

    const subCategories = await category.related('expenseSubcategories').query()

    // Delete all subcategories
    if (subCategories.length > 0) {
      await ExpenseCategory.query()
        .whereIn(
          'id',
          subCategories.map((sub) => sub.id)
        )
        .delete()

      logger.log('info', '[ExpenseCategoriesController] Subcategories deleted', {
        parentId: category.id,
        deletedSubcategories: subCategories.map((sub) => sub.id),
      })
    }

    // Delete the parent category
    await category.delete()

    logger.log('info', '[ExpenseCategoriesController] Expense Category deleted', {
      id: category.id,
    })

    return { success: true }
  }
}
