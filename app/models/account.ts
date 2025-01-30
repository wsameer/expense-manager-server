import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare group: string

  @column()
  declare balance: number

  @column()
  declare description: string | null

  // Foreign key for User relationship
  @column()
  declare userId: number

  // Self-referential foreign key for payment account
  @column()
  declare paymentAccountId: number | null

  // Relationship with User
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Self-referential relationship for payment account
  @belongsTo(() => Account, {
    foreignKey: 'paymentAccountId',
  })
  // property name to access referenced payment account
  declare paymentAccount: BelongsTo<typeof Account>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public async incrementBalance(amount: number) {
    this.balance += amount
    await this.save()
  }

  public async decrementBalance(amount: number) {
    this.balance -= amount
    await this.save()
  }
}
