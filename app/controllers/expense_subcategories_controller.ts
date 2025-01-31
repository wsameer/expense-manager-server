import { ForbiddenException } from '#exceptions/forbidden_exception'
import ExpenseCategory from '#models/expense_category'
import ExpenseSubcategory from '#models/expense_subcategory'
import {
  createExpenseSubcategoryValidator,
  updateExpenseSubcategoryValidator,
} from '#validators/expense_subcategory'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { errors } from '@vinejs/vine'

export default class ExpenseSubcategoriesController {
  async store({ auth, bouncer, params, request }: HttpContext) {
    await auth.authenticate()

    // validation
    const validatedData = await createExpenseSubcategoryValidator.validate({
      ...params,
      ...request.all(),
    })

    const category = await ExpenseCategory.findByOrFail(params)

    // authorization
    if (await bouncer.with('ExpenseCategoryPolicy').denies('update', category)) {
      throw new ForbiddenException('You are not allowed to modify this category')
    }

    const subCategory = await ExpenseSubcategory.create({
      name: validatedData.name,
      expenseCategoryId: category.id,
    })

    // log
    logger.log('info', `[ExpenseSubcategoriesController] Subcategory created: ${subCategory.id}`)

    // return response
    return subCategory
  }

  /**
   * Get a single subcategory
   * @param param0 subcategory id
   * @returns subcategory details
   */
  async show({ auth, bouncer, params }: HttpContext) {
    await auth.authenticate()

    // validation
    if (!params.id || !params.sub_id) {
      throw new errors.E_VALIDATION_ERROR('Subcategory ID is required or invalid')
    }

    // Get the parent category first
    const expenseCategory = await ExpenseCategory.findOrFail(params.id)

    // Check if user has access to the parent category
    await bouncer.with('ExpenseSubcategoryPolicy').authorize('view', expenseCategory)

    // User Ownership
    const subCategory = await ExpenseSubcategory.findOrFail(params.sub_id)

    // return response
    return subCategory
  }

  async update({ auth, bouncer, params, request }: HttpContext) {
    await auth.authenticate()

    const validatedData = await updateExpenseSubcategoryValidator.validate({
      ...params.sub_id,
      ...request.all(),
    })

    // Get the parent category first
    const expenseCategory = await ExpenseCategory.findOrFail(params.id)

    // Check if user has access to the parent category
    await bouncer.with('ExpenseSubcategoryPolicy').authorize('update', expenseCategory)

    // Get the subcategory to update
    const subCategory = await ExpenseSubcategory.query()
      .where('id', params.sub_id)
      .where('expenseCategoryId', expenseCategory.id)
      .first()

    if (!subCategory) {
      throw new ForbiddenException('Subcategory not found or does not belong to this category')
    }

    subCategory.name = validatedData.name

    await subCategory.save()

    // log
    logger.log('info', `[ExpenseSubcategoriesController] Subcategory ${subCategory.id} updated`)

    return subCategory
  }

  async destroy({ auth, bouncer, params }: HttpContext) {
    await auth.authenticate()

    // validation
    if (!params.id || !params.sub_id) {
      throw new errors.E_VALIDATION_ERROR('Bad request')
    }

    // Get the parent category first
    const expenseCategory = await ExpenseCategory.findOrFail(params.id)

    // Check if user has access to the parent category
    await bouncer.with('ExpenseSubcategoryPolicy').authorize('delete', expenseCategory)

    // User Ownership
    const subCategory = await ExpenseSubcategory.query()
      .where('id', params.sub_id)
      .where('expenseCategoryId', expenseCategory.id)
      .first()

    if (!subCategory) {
      throw new ForbiddenException('Subcategory not found or does not belong to this category')
    }

    // delete subcategory
    await subCategory.delete()

    // log
    logger.log('info', `[ExpenseSubcategoriesController] Subcategory ${subCategory.id} deleted`)

    return { success: true }
  }
}
