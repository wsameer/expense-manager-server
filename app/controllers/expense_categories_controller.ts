import type { HttpContext } from '@adonisjs/core/http'

import ExpenseCategory from '#models/expense_category'
import { createExpenseCategoryValidator } from '#validators/expense_category'
import { ForbiddenException } from '#exceptions/forbidden_exception.ts'

export default class ExpenseCategoriesController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()
    const categories = await ExpenseCategory.findManyBy({ userId: user.id })
    return categories
  }

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

  async show({ params }: HttpContext) {}

  async update({ auth, bouncer, request }: HttpContext) {
    const user = await auth.authenticate()

    const validatedData = await createExpenseCategoryValidator.validate({
      ...request.all(),
      userId: user.id,
    })

    if (await bouncer.with('ExpenseCategoryPolicy').denies('update', validatedData)) {
      throw new ForbiddenException('You are not allowed to update this category')
    }

    const category = await ExpenseCategory.updateOrCreate(
      { name: validatedData.name },
      { isDefault: validatedData.isDefault ?? false }
    )

    return category
  }

  async destroy({ bouncer, auth, params }: HttpContext) {
    await auth.authenticate()

    const category = await ExpenseCategory.findByOrFail(params)

    if (await bouncer.with('ExpenseCategoryPolicy').denies('delete', category)) {
      throw new ForbiddenException('You are not allowed to delete this category')
    }

    await category.delete()

    return { success: true }
  }
}
