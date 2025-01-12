import type { HttpContext } from '@adonisjs/core/http'

export default class AccountsController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    /**
     * First, authenticate the user
     */
    await auth.authenticate()

    
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
  async destroy({ params }: HttpContext) {}
}