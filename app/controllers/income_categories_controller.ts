import { ForbiddenException } from '#exceptions/forbidden_exception'
import IncomeCategory from '#models/income_category'
import CategoryOrderManagementService from '#services/category_order_management_service'
import {
  createIncomeCategoryValidator,
  updateIncomeCategoryValidator,
} from '#validators/income_category'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class IncomeCategoriesController {
  constructor(private categoryOrderManagementService: CategoryOrderManagementService) {}

  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()

    const categories = await IncomeCategory.query().where('userId', user.id).orderBy('order', 'asc')

    return categories
  }

  async store({ auth, bouncer, request }: HttpContext) {
    // authenticate
    const user = await auth.authenticate()

    // authorization
    await bouncer.with('IncomeCategoryPolicy').allows('create')

    // validation
    const validatedData = await createIncomeCategoryValidator.validate(request.all())

    // create the income category
    const category = await IncomeCategory.create({
      ...validatedData,
      description: validatedData.description ?? undefined,
      userId: user.id,
    })

    // return
    return category
  }

  async show({ auth, bouncer, params }: HttpContext) {
    await auth.authenticate()

    const category = await IncomeCategory.query()
      .where('id', params.id)
      .preload('transactions')
      .firstOrFail()

    if (await bouncer.with('IncomeCategoryPolicy').denies('view', category)) {
      throw new ForbiddenException('You are not allowed to view this income category')
    }

    return category
  }

  async update({ auth, bouncer, params, request }: HttpContext) {
    await auth.authenticate()

    const validatedData = await updateIncomeCategoryValidator.validate({
      ...params,
      ...request.all(),
    })

    const category = await IncomeCategory.findByOrFail(params)

    if (await bouncer.with('IncomeCategoryPolicy').denies('update', category)) {
      throw new ForbiddenException('You are not authorized to update this category')
    }

    category.name = validatedData.name
    category.description = validatedData.description ?? undefined

    await category.save()

    return category
  }

  async destroy({ params, auth, bouncer }: HttpContext) {
    await auth.authenticate()

    const incomeCategory = await IncomeCategory.findByOrFail(params)

    if (await bouncer.with('IncomeCategoryPolicy').denies('delete', incomeCategory)) {
      throw new ForbiddenException('You are not authorized to delete this income category')
    }

    await incomeCategory.delete()
    // Delete the parent category and reorder the remaining
    await this.categoryOrderManagementService.deleteWithReordering(IncomeCategory, incomeCategory)

    return { success: true }
  }
}
