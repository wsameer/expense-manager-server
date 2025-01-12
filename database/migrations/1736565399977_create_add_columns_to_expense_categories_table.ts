import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'expense_categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      
      table.string('name').notNullable()

      table.boolean('is_default').defaultTo(false)
    
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}