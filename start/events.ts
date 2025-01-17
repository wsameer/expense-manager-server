import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

import UserRegistered from '#events/user_registered'
const CreateCashAccount = () => import('#listeners/create_cash_account')

emitter.on(UserRegistered, [CreateCashAccount])

emitter.onError((event, error, eventData) => {
  logger.error('Event handling failed:', {
    event: event.constructor.name,
    error: error.message,
    data: eventData,
  })
})
