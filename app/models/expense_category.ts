import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import ExpenseSubcategory from './expense_subcategory.js'
import { type BelongsTo, type HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Transaction from './transaction.js'

export default class ExpenseCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare isDefault: boolean

  @column()
  declare order: number

  // Relationships
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => ExpenseSubcategory, {
    serializeAs: 'subcategories',
  })
  declare expenseSubcategories: HasMany<typeof ExpenseSubcategory>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
