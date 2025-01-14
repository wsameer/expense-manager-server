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
    router.get('/users', [UsersController, 'index']).as('get-all-users')

    router.get('/accounts', [AccountsController, 'index']).as('get-accounts')
    router.post('/accounts', [AccountsController, 'store']).as('create-account')
    router.get('/accounts-stats', [AccountStatsController, 'index']).as('get-account-stats')
  })
  .use(middleware.auth()) // default guard is 'web' set in config/auth.ts
  .as('protected-routes')
  .prefix('api')
