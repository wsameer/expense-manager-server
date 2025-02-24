import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expense_subcategories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('expense_category_id')
        .unsigned()
        .references('expense_categories.id')
        .notNullable()
        .onDelete('CASCADE')
      table.string('name')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
