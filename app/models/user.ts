import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Account from './account.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ExpenseCategory from './expense_category.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // One user can have many accounts
  @hasMany(() => Account)
  declare accounts: HasMany<typeof Account>

  // One user can have many expense categories
  @hasMany(() => ExpenseCategory)
  declare expenseCategories: HasMany<typeof ExpenseCategory>

  @hasMany(() => )
}
