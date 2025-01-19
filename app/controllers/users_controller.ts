import type { HttpContext } from '@adonisjs/core/http'

// TESTING
export default class UsersController {
  async index({ auth }: HttpContext) {
    await auth.authenticate()
    return auth.user
  }
}
