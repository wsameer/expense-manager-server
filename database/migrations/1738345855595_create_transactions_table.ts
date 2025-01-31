import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      table.dateTime('date')

      table.enum('type', ['bank_to_bank', 'expense', 'income'])

      table.decimal('amount', 10, 2)

      table.integer('from_account_id').unsigned().references('accounts.id').onDelete('CASCADE')

      table
        .integer('to_account_id')
        .unsigned()
        .nullable()
        .references('accounts.id')
        .onDelete('CASCADE')

      table
        .integer('expense_category_id')
        .unsigned()
        .nullable()
        .references('expense_categories.id')
        .onDelete('CASCADE')

      table
        .integer('expense_subcategory_id')
        .unsigned()
        .nullable()
        .references('expense_subcategories.id')
        .onDelete('CASCADE')

      table
        .integer('income_category_id')
        .unsigned()
        .nullable()
        .references('income_categories.id')
        .onDelete('CASCADE')

      table.text('note').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()

      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
