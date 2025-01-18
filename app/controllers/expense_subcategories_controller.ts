import type { HttpContext } from '@adonisjs/core/http'

export default class ExpenseSubcategoriesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ bouncer, request, response }: HttpContext) {
    try {
      await bouncer
    } catch (error) {
      
    }
  }

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
  async destroy({ params }: HttpContext) {}
}