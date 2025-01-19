import type { HttpContext } from '@adonisjs/core/http'

export default class UserProfilesController {
  async index({}: HttpContext) {}

  async store({ request }: HttpContext) {}

  async show({ params }: HttpContext) {}

  // async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
