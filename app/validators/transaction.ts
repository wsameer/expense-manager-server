import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'
import { TransactionType } from '../types/transactions.js'
import { luxonDateRule } from './rules/luxon_date.js'

const transactionTypes = Object.values(TransactionType).filter(
  (value) => typeof value === 'string'
) as TransactionType[]

export const createTransactionValidator = vine.compile(
  vine.object({
    type: vine.enum(transactionTypes),
    date: vine.string().use(luxonDateRule()),
    amount: vine.number().decimal([0, 2]),
    from_account_id: vine
      .number()
      .optional()
      .requiredWhen('type', '!=', TransactionType.INCOME)
      .use(existsInRule({ table: 'accounts', column: 'id' })),
    to_account_id: vine
      .number()
      .optional()
      .requiredWhen('type', '!=', TransactionType.EXPENSE)
      .use(existsInRule({ table: 'accounts', column: 'id' })),
    income_category_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType.INCOME)
      .use(existsInRule({ table: 'income_categories', column: 'id' })),
    expense_category_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType.EXPENSE)
      .use(existsInRule({ table: 'expense_categories', column: 'id' })),
    expense_subcategory_id: vine
      .number()
      .nullable()
      .optional()
      .use(existsInRule({ table: 'expense_subcategories', column: 'id' })),
    note: vine.string().maxLength(255).optional(),
  })
)

export const updateTransactionValidator = vine.compile(
  vine.object({
    id: vine
      .number()
      .positive()
      .use(existsInRule({ table: 'transactions', column: 'id' })),
    type: vine.enum(transactionTypes),
    date: vine.string().use(luxonDateRule()),
    amount: vine.number().decimal([0, 2]),
    from_account_id: vine
      .number()
      .optional()
      .requiredWhen('type', '!=', TransactionType.INCOME)
      .use(existsInRule({ table: 'accounts', column: 'id' })),
    to_account_id: vine
      .number()
      .optional()
      .requiredWhen('type', '!=', TransactionType.EXPENSE)
      .use(existsInRule({ table: 'accounts', column: 'id' })),
    income_category_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType.INCOME)
      .use(existsInRule({ table: 'income_categories', column: 'id' })),
    expense_category_id: vine
      .number()
      .optional()
      .requiredWhen('type', '=', TransactionType.EXPENSE)
      .use(existsInRule({ table: 'expense_categories', column: 'id' })),
    expense_subcategory_id: vine
      .number()
      .nullable()
      .optional()
      .use(existsInRule({ table: 'expense_subcategories', column: 'id' })),
    note: vine.string().maxLength(255).optional(),
  })
)

export const dateValidator = vine.compile(
  vine.object({
    year: vine.number().positive().min(2000),
    month: vine.number().positive().min(1).max(31),
  })
)
