/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

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
