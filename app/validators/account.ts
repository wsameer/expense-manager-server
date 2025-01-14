import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'
import { AccountType } from '../types/accounts.js'

export const createAccountValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(48),
    group: vine.enum(AccountType),
    balance: vine.number().decimal([0, 2]),
    payment_account_id: vine
      .number()
      .optional()
      .use(existsInRule({ table: 'accounts', column: 'id' })),
    description: vine.string().trim().escape().maxLength(300).nullable(),
  })
)
