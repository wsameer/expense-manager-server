import vine from '@vinejs/vine'

export const registerSchema = vine.object({
  name: vine.string().minLength(3).maxLength(50),
  email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
  password: vine.string().minLength(6).maxLength(32),
})

export const registerValidator = vine.compile(registerSchema)
