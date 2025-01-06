import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  /**
   * Display a list of resource
   */
  // async index({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, response }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
    const { email, password } = request.only(['email', 'password'])

    /**
     * Step 2: Validate user input
     */

    /**
     * Step 3: Verify credentials
     */
    const user = await User.verifyCredentials(email, password)

    /**
     * Step 3: Login user
     */
    await auth.use('web').login(user)

    /**
     * Step 4: Send them to a protected route
     */
    response.send({
      data: user,
      success: true,
    })
  }

  /**
   * Delete record
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.send({
      redirectTo: '/login',
    })
  }
}
