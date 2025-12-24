import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_index_to_accounts_user_ids'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('account_number').nullable()
      table.unique(['account_number'])
      table.index('user_id')
    })
  }

  async down() {
    this.schema.alterTable('accounts', (table) => {
      table.dropIndex('user_id') // Rollback by removing the index
    })
  }
}
