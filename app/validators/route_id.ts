import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'

export const idValidator = (table: string) =>
  vine.compile(
    vine.object({
      id: vine
        .number()
        .positive()
        .use(existsInRule({ table, column: 'id' })),
    })
  )
