import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, { response }: HttpContext) {
    const { message, messages, code, stack, status } = error

    if (code === 'E_UNAUTHORIZED') {
      return response.unauthorized({
        message: 'Please login to access this resource',
      })
    }

    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return response.badRequest({
        message: 'Invalid input parameters',
        errors: messages,
      })
    }

    return response.status(status || 500).json({
      message: message,
      code: code,
      ...(this.debug ? { stack: stack } : {}),
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
