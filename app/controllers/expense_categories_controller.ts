import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

import ExpenseCategory from '#models/expense_category'
import {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
} from '#validators/expense_category'
import { ForbiddenException } from '#exceptions/forbidden_exception'
import { idValidator } from '#validators/route_id'
import { inject } from '@adonisjs/core'
import CategoryOrderManagementService from '#services/category_order_management_service'

@inject()
export default class ExpenseCategoriesController {
  constructor(private categoryOrderManagementService: CategoryOrderManagementService) {}

  /**
   * GET all categories and subcategories for a user
   * @returns category object
   */
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()
    const categories = await ExpenseCategory.query()
      .where('userId', user.id)
      .preload('expenseSubcategories')
      .orderBy('order', 'asc')
    return categories
  }

  /**
   * Create a new Expense Category
   * @returns newly created category details
   */
  async store({ auth, bouncer, request }: HttpContext) {
    const user = await auth.authenticate()

    await bouncer.with('ExpenseCategoryPolicy').allows('create')

    const validatedData = await request.validateUsing(createExpenseCategoryValidator)

    const category = await ExpenseCategory.create({
      userId: user.id,
      name: validatedData.name,
      isDefault: validatedData.isDefault ?? false,
      order: validatedData.order,
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

    const validatedData = await idValidator('expense_categories').validate(params)

    const category = await ExpenseCategory.query()
      .where('id', validatedData.id)
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

    // validating the id
    await idValidator('expense_categories').validate(params)

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

    // Delete the parent category and reorder the remaining
    await this.categoryOrderManagementService.deleteWithReordering(ExpenseCategory, category)

    logger.log('info', '[ExpenseCategoriesController] Expense Category deleted', {
      id: category.id,
    })

    return { success: true }
  }
}
