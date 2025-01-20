import vine from '@vinejs/vine'
import { TransactionType } from '../types/transactions.js'
import { existsInRule } from './rules/exists_in.js'

export const createTransactionValidator = vine.compile(
  vine.object({
    type: vine.enum(TransactionType),
    date: vine.date(), // YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
    amount: vine.number().decimal([0, 2]),
    from_account_id: vine.number().use(existsInRule({ table: 'accounts', column: 'id' })),
    to_account_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType[0])
      .use(existsInRule({ table: 'accounts', column: 'id' })),
    income_category_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType[2])
      .use(existsInRule({ table: 'income_categories', column: 'id' })),
    expense_category_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType[1])
      .use(existsInRule({ table: 'expense_categories', column: 'id' })),
    expense_subcategory_id: vine
      .number()
      .nullable()
      .optional()
      .use(existsInRule({ table: 'expense_subcategories', column: 'id' })),
    note: vine.string().maxLength(255).nullable(),
  })
)
