import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import ExpenseCategory from './expense_category.js'

export default class ExpenseSubcategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare expenseCategoryId: number

  @column()
  declare name: string

  @belongsTo(() => ExpenseCategory)
  declare expenseCategory: BelongsTo<typeof ExpenseCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
