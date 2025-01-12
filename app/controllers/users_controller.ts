import type { HttpContext } from '@adonisjs/core/http'

// TESTING 
export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    /**
     * First, authenticate the user
     */
    await auth.authenticate()

    /**
     * Then access the user object
     */
    return response.status(200).send({
      data: auth.user,
    })
  }
}
