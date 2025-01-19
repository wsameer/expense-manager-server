import type { HttpContext } from '@adonisjs/core/http'

import ExpenseCategory from '#models/expense_category'
import {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
} from '#validators/expense_category'
import { ForbiddenException } from '#exceptions/forbidden_exception.ts'

export default class ExpenseCategoriesController {
  /**
   * GET all categories and subcategories for a user
   * @returns category object
   */
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()
    const categories = await ExpenseCategory.findManyBy({ userId: user.id })
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
   */
  async show({ params, bouncer, auth }: HttpContext) {
    await auth.authenticate()

    const category = await ExpenseCategory.findByOrFail(params)
    if (await bouncer.with('ExpenseCategoryPolicy').denies('view', category)) {
      throw new ForbiddenException('You are not allowed to view this expense category')
    }

    return category
  }

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

  async destroy({ bouncer, auth, params }: HttpContext) {
    await auth.authenticate()

    const category = await ExpenseCategory.findByOrFail(params)

    if (await bouncer.with('ExpenseCategoryPolicy').denies('delete', category)) {
      throw new ForbiddenException('You are not authorized to delete this category')
    }

    await category.delete()

    return { success: true }
  }
}
