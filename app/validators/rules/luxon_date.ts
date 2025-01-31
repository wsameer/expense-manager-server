import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

function luxonDate(value: unknown, _: unknown, field: FieldContext) {
  if (typeof value !== 'string') {
    return
  }

  const date = DateTime.fromISO(value)

  if (!date.isValid) {
    field.report('Invalid date format', 'luxonDate', field)
  }
}

export const luxonDateRule = vine.createRule(luxonDate)
