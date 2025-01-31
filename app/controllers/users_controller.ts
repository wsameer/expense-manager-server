import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ auth }: HttpContext) {
    await auth.authenticate()
    return User.all()
  }
}
