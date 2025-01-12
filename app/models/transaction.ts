import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import Account from './account.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import ExpenseCategory from './expense_category.js'
import ExpenseSubcategory from './expense_subcategory.js'
import IncomeCategory from './income_category.js'

// Define transaction types
type TransactionType = 'bank_to_bank' | 'expense' | 'income'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare date: DateTime

  @column()
  declare type: TransactionType

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
}
