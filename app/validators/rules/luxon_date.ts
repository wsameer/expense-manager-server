import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

function luxonDate(value: unknown, _, field: FieldContext) {
  console.log('🚀 ~ luxonDate ~ field:', field.value)
  console.log('🚀 ~ luxonDate ~ value:', value)

  if (typeof value !== 'string') {
    return
  }

  const date = DateTime.fromISO(value)
  console.log("🚀 ~ luxonDate ~ date:", date)
  console.log("🚀 ~ luxonDate ~ date:", date.isValid)
  
  
  if (!date.isValid) {
    field.report('Invalid date format', 'luxonDate', field)
  }
}

export const luxonDateRule = vine.createRule(luxonDate)
