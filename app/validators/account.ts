import vine from '@vinejs/vine'
import { existsInRule } from './rules/exists_in.js'

export const createAccountValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(48),
    group: vine.enum(['CASH', 'CHEQUING', 'CREDIT_CARD', 'SAVINGS', 'INVESTMENTS']),
    balance: vine.number().decimal([0, 2]),
    paymentAccountId: vine
      .number()
      .use(existsInRule({ table: 'accounts', column: 'id' }))
      .nullable(),
    description: vine.string().trim().escape().maxLength(300).nullable(),
  })
)