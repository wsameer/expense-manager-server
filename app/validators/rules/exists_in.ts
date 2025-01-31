import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
}

async function existsIn(value: unknown, options: Options, field: FieldContext) {
  if (!value || typeof value !== 'number') {
    return true
  }

  const record = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (!record) {
    field.report('The {{field}} field does not exist in database', 'existsIn', field)
  }
}
export const existsInRule = vine.createRule(existsIn)
