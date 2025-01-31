import Transaction from '#models/transaction'
import { dateValidator } from '#validators/transaction'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ExpenseCategoryTotalsController {
  async index({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    const [year, month] = request.qs().month.split('-').map(Number)

    await dateValidator.validate({ year, month })

    const expenseCategoriesTotal = await Transaction.query()
      .where('type', 'expense')
      .where('expense_categories.user_id', user.id)
      .apply((scopes) => scopes.byMonth(year, month))
      .join('expense_categories', 'transactions.expense_category_id', '=', 'expense_categories.id')
      .groupBy('expense_categories.id', 'expense_categories.name')
      .select(
        'expense_categories.id',
        'expense_categories.name as category',
        db.raw('SUM(transactions.amount) as total_amount')
      )

    const formattedResult = expenseCategoriesTotal.map((row: Transaction) => ({
      id: row.id,
      category: row.$extras.category,
      total_amount: row.$extras.total_amount,
    }))

    return formattedResult
  }
}
