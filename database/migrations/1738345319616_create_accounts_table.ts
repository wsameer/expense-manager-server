import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('group').notNullable()
      table.decimal('balance', 10, 2).defaultTo(0)
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table.text('description').nullable()
      table
        .integer('payment_account_id')
        .unsigned()
        .references('accounts.id')
        .nullable()
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
