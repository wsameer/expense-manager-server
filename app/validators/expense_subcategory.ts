import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'

export const createExpenseSubcategoryValidator = vine.compile(
  vine.object({
    expenseCategoryId: vine
      .number()
      .optional()
      .use(existsInRule({ table: 'expense_categories', column: 'id' })),
    name: vine.string().trim().minLength(3).maxLength(48),
  })
)
