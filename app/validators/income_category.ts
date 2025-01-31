import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'

export const createIncomeCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(48),
    description: vine.string().trim().escape().maxLength(300).nullable(),
  })
)

export const updateIncomeCategoryValidator = vine.compile(
  vine.object({
    id: vine.number().use(existsInRule({ table: 'income_categories', column: 'id' })),
    name: vine.string().trim().minLength(3).maxLength(48),
    description: vine.string().trim().escape().maxLength(300).nullable(),
  })
)
