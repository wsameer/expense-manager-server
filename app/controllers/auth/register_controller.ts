import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { registerValidator } from '#validators/register'

export default class RegisterController {
  async show({}: HttpContext) {}

  async store({ request, response }: HttpContext) {
    try {
      // Validate request data
      const data = await request.validateUsing(registerValidator)

      // Create user with validated data
      await User.create({
        name: data.name,
        email: data.email,
        password: data.password, // no need to has as it's already done in User model
      })

      return response.ok({ success: true })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.badRequest({
          status: 'error',
          errors: error.messages,
          message: 'Validation failed',
        })
      }

      // Handle unexpected errors
      return response.internalServerError({
        status: 'error',
        message: 'Something went wrong',
      })
    }
  }
}
