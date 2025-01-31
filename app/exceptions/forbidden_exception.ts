import { Exception } from '@adonisjs/core/exceptions'

export class ForbiddenException extends Exception {
  constructor(message: string) {
    super(message, { status: 403, code: 'E_FORBIDDEN' })
  }
}
