import Transaction from '#models/transaction'
import { dateValidator } from '#validators/transaction'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class IncomeCategoryTotalsController {
  async index({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    const [year, month] = request.qs().month.split('-').map(Number)

    await dateValidator.validate({ year, month })

    const incomeCategoriesTotal = await Transaction.query()
      .where('type', 'income')
      .where('income_categories.user_id', user.id)
      .apply((scopes) => scopes.byMonth(year, month))
      .join('income_categories', 'transactions.income_category_id', '=', 'income_categories.id')
      .groupBy('income_categories.id', 'income_categories.name')
      .select(
        'income_categories.id',
        'income_categories.name as category',
        db.raw('SUM(transactions.amount) as total_amount')
      )

    const formattedResult = incomeCategoriesTotal.map((row: Transaction) => ({
      id: row.id,
      category: row.$extras.category,
      total_amount: row.$extras.total_amount,
    }))

    return formattedResult
  }
}
