/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const IncomeCategoriesController = () => import('#controllers/income_categories_controller')
const ExpenseSubcategoriesController = () => import('#controllers/expense_subcategories_controller')
const ExpenseCategoriesController = () => import('#controllers/expense_categories_controller')
const AccountStatsController = () => import('#controllers/account_stats_controller')
const UsersController = () => import('#controllers/users_controller')
const AccountsController = () => import('#controllers/accounts_controller')
const SessionController = () => import('#controllers/auth/session_controller')
const RegisterController = () => import('#controllers/auth/register_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/login', [SessionController, 'store']).as('login')
    router.delete('/logout', [SessionController, 'destroy']).as('logout')
    router.post('/register', [RegisterController, 'store']).as('register_user')
  })
  .as('auth-routes')
  .prefix('api/auth')

router
  .group(() => {
    router.get('/accounts', [AccountsController, 'index']).as('get-accounts')
    router.post('/accounts', [AccountsController, 'store']).as('create-account')
    router.get('/accounts/:id', [AccountsController, 'show']).as('get-account')
    router.put('/accounts/:id', [AccountsController, 'update']).as('update-account')
    router.delete('/accounts/:id', [AccountsController, 'destroy']).as('delete-account')

    router.get('/accounts-stats', [AccountStatsController, 'index']).as('get-account-stats')
  })
  .use(middleware.auth()) // default guard is 'web' set in config/auth.ts
  .as('accounts-routes')
  .prefix('api')

router
  .group(() => {
    router.get('/users', [UsersController, 'index']).as('get-all-users')
  })
  .use(middleware.auth())
  .as('user-routes')
  .prefix('api')

router
  .group(() => {
    router
      .get('/income-categories', [IncomeCategoriesController, 'index'])
      .as('get-income-categories')

    router
      .post('/income-categories', [IncomeCategoriesController, 'store'])
      .as('create-income-category')

    router
      .get('/income-category/:id', [IncomeCategoriesController, 'show'])
      .as('get-income-category')

    router
      .put('/income-category/:id', [IncomeCategoriesController, 'update'])
      .as('update-income-category')

    router
      .delete('/income-categories/:id', [IncomeCategoriesController, 'destroy'])
      .as('delete-income-category')
  })
  .use(middleware.auth())
  .as('income-categories-routes')
  .prefix('api')

router
  .group(() => {
    router
      .get('/expense-categories', [ExpenseCategoriesController, 'index'])
      .as('get-expense-categories')

    router
      .post('/expense-categories', [ExpenseCategoriesController, 'store'])
      .as('create-expense-category')

    router
      .get('/expense-categories/:id', [ExpenseCategoriesController, 'show'])
      .as('get-expense-category')

    router
      .put('/expense-categories/:id', [ExpenseCategoriesController, 'update'])
      .as('update-expense-category')

    router
      .delete('/expense-categories/:id', [ExpenseCategoriesController, 'destroy'])
      .as('delete-expense-category')
  })
  .use(middleware.auth())
  .as('expense-categories-routes')
  .prefix('api')

router
  .group(() => {
    router
      .get('/expense-subcategories', [ExpenseSubcategoriesController, 'index'])
      .as('get-expense-subcategories')

    router
      .post('/expense-subcategories', [ExpenseSubcategoriesController, 'store'])
      .as('create-expense-subcategory')

    router
      .get('/expense-subcategories/:id', [ExpenseSubcategoriesController, 'show'])
      .as('get-expense-subcategory')

    router
      .put('/expense-subcategories/:id', [ExpenseSubcategoriesController, 'update'])
      .as('update-expense-subcategory')

    router
      .delete('/expense-subcategories/:id', [ExpenseSubcategoriesController, 'destroy'])
      .as('delete-expense-subcategory')
  })
  .use(middleware.auth())
  .as('expense-subcategories-routes')
  .prefix('api')
