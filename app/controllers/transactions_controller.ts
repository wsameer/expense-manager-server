import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  /**
   * Display a list of transactions
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const transactions = await Transaction.query()
        .where('userId', user.id)
        .orderBy('createdAt', 'desc')

      return response.ok(transactions)
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED') {
        return response.unauthorized({
          errors: [{ message: 'Please login to access this resource' }],
        })
      }

      return response.internalServerError({
        errors: [{ message: 'An error occurred while fetching all transactions' }],
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
  async destroy({ params }: HttpContext) {}
}
