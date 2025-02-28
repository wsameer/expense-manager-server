import ExpenseCategory from '#models/expense_category'
import IncomeCategory from '#models/income_category'
import db from '@adonisjs/lucid/services/db'

type Category = typeof ExpenseCategory | typeof IncomeCategory

export default class CategoryOrderManagementService {
  async reorderAfterDeletion(
    model: Category,
    userId: number,
    deletedOrder: number,
    trx: any
  ): Promise<void> {
    await model
      .query({ client: trx })
      .where('user_id', userId)
      .where('order', '>', deletedOrder)
      .decrement('order', 1)
  }

  async deleteWithReordering(model: Category, rowItem: InstanceType<Category>) {
    const userId = rowItem.userId
    const orderValue = rowItem.order

    try {
      await db.transaction(async (trx) => {
        await rowItem.useTransaction(trx).delete()

        if (orderValue !== null && orderValue !== undefined) {
          await this.reorderAfterDeletion(model, userId, orderValue, trx)
        }
      })
    } catch (error) {
      console.error('Error deleting and reordering category:', error)
      throw error
    }
  }
}
