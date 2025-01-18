import IncomeCategory from '#models/income_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class IncomeCategoriesController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const categories = await IncomeCategory.query()
        .where('userId', user.id)
        .orderBy('createdAt', 'desc')

      return response.ok(categories)
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED') {
        return response.unauthorized({
          errors: [{ message: 'Please login to access this resource' }],
        })
      }

      return response.internalServerError({
        errors: [{ message: 'An error occurred while fetching income categories' }],
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, auth, bouncer, response }: HttpContext) {
    await auth.authenticate()

    const incomeCategory = await IncomeCategory.findByOrFail(params.id)

    if (await bouncer.with('IncomeCategoryPolicy').denies('delete', incomeCategory)) {
      return response.forbidden({
        errors: [{ message: 'You cannot delete this account' }],
      })
    }

    await incomeCategory.delete()

    return response.ok({
      success: true,
    })
  }
}
