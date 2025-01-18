import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'

export const createIncomeCategoryValidator = vine.compile(
  vine.object({
    userId: vine
      .number()
      .optional()
      .use(existsInRule({ table: 'users', column: 'id' })),
    name: vine.string().trim().minLength(3).maxLength(48),
    description: vine.string().trim().escape().maxLength(300).nullable(),
  })
)
