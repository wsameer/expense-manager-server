import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expense_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')

      table.string('name').notNullable()

      table.boolean('is_default').defaultTo(false)

      table.timestamp('created_at')

      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
