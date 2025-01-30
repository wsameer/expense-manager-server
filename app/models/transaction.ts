import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import User from './user.js'
import Account from './account.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import ExpenseCategory from './expense_category.js'
import ExpenseSubcategory from './expense_subcategory.js'
import IncomeCategory from './income_category.js'
import { TransactionType } from '../types/transactions.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column.dateTime()
  declare date: DateTime

  @column()
  declare type: typeof TransactionType

  @column()
  declare amount: number

  @column()
  declare fromAccountId: number

  @column()
  declare toAccountId?: number

  @column()
  declare expenseCategoryId?: number

  @column()
  declare expenseSubcategoryId?: number

  @column()
  declare incomeCategoryId?: number

  @column()
  declare note?: string

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Account, {
    foreignKey: 'fromAccountId',
  })
  declare fromAccount: BelongsTo<typeof Account>

  @belongsTo(() => Account, {
    foreignKey: 'toAccountId',
  })
  declare toAccount: BelongsTo<typeof Account>

  @belongsTo(() => ExpenseCategory, {
    foreignKey: 'expenseCategoryId',
  })
  declare expenseCategory: BelongsTo<typeof ExpenseCategory>

  @belongsTo(() => ExpenseSubcategory, {
    foreignKey: 'expenseSubcategoryId',
  })
  declare expenseSubcategory: BelongsTo<typeof ExpenseSubcategory>

  @belongsTo(() => IncomeCategory, {
    foreignKey: 'incomeCategoryId',
  })
  declare incomeCategory: BelongsTo<typeof IncomeCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public static byMonth = scope((query, year: number, month: number) => {
    const startDate = DateTime.fromObject({ year, month })
      .startOf('month')
      .toFormat('yyyy-MM-dd HH:mm:ss')
    const endDate = DateTime.fromObject({ year, month })
      .endOf('month')
      .toFormat('yyyy-MM-dd HH:mm:ss')

    query.whereBetween('date', [startDate, endDate])
  })
}
