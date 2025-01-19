import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  async index({ auth }: HttpContext) {
    const user = await auth.authenticate()

    const transactions = await Transaction.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')

    return transactions
  }

  // async store({ request }: HttpContext) {}

  // async show({ params }: HttpContext) {}

  // async update({ params, request }: HttpContext) {}

  // async destroy({ params }: HttpContext) {}
}
