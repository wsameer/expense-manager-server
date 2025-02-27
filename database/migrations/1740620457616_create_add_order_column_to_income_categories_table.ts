import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'income_categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('order').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => table.dropColumn('order'))
  }
}
