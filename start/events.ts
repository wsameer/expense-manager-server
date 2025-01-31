import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'

import UserRegistered from '#events/user_registered'

const CreateExpenseCategories = () => import('#listeners/create_expense_categories')
const CreateCashAccount = () => import('#listeners/create_cash_account')
const CreateIncomeCategories = () => import('#listeners/create_income_categories')

emitter.listen(UserRegistered, [CreateCashAccount, CreateExpenseCategories, CreateIncomeCategories])

emitter.onError((event, error, eventData) => {
  logger.error('Event handling failed:', {
    event: event.constructor.name,
    error: error.message,
    data: eventData,
  })
})
