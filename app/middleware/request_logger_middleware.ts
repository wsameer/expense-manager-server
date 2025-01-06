import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle({ request }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    logger.info(`[${new Date().toISOString()}] ${request.method()} ${request.url()}`)

    /**
     * Call next method in the pipeline and return its output
     */
    return await next()
  }
}
