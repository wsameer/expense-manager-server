import vine from '@vinejs/vine'
import { AccountStatsType } from '../types/accounts.js'

export const accountStatsValidator = vine.compile(
  vine.object({
    type: vine.enum(AccountStatsType),
  })
)
