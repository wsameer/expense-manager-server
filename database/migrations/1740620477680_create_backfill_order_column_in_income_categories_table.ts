import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'income_categories'

  async up() {
    const db = this.db

    // Get all users
    const users = await db.from('users').select('id')

    for (const user of users) {
      const categories = await db
        .from(this.tableName)
        .where('user_id', user.id)
        .orderBy('created_at', 'asc')

      /* eslint-disable @unicorn/no-for-loop */
      for (let i = 0; i < categories.length; i++) {
        await db
          .from(this.tableName)
          .where('id', categories[i].id)
          .update({ order: i + 1 })
      }
    }

    // Make the order column required after backfill
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('order').notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('order').nullable().alter()
    })
  }
}
