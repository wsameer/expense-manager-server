import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'

export const createExpenseCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(48),
    isDefault: vine.boolean().optional(),
  })
)

export const updateExpenseCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(48),
    id: vine.number().use(existsInRule({ table: 'expense_categories', column: 'id' })),
  })
)
