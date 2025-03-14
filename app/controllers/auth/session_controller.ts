import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    response.send({
      data: user,
      success: true,
    })
  }

  /**
   * Delete session / Logout
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.send({
      success: true,
    })
  }
}
