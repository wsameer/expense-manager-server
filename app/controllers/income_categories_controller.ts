import { ForbiddenException } from '#exceptions/forbidden_exception.ts'
import IncomeCategory from '#models/income_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class IncomeCategoriesController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()

    const categories = await IncomeCategory.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')

    return categories
  }

  // async store({ request }: HttpContext) {}

  // async show({ params }: HttpContext) {}

  // async update({ params, request }: HttpContext) {}

  async destroy({ params, auth, bouncer }: HttpContext) {
    await auth.authenticate()

    const incomeCategory = await IncomeCategory.findByOrFail(params.id)

    if (await bouncer.with('IncomeCategoryPolicy').denies('delete', incomeCategory)) {
      throw new ForbiddenException('You are not authorized to delete this income category')
    }

    await incomeCategory.delete()

    return { success: true }
  }
}
