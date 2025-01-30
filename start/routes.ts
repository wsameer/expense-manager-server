/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegisterController = () => import('#controllers/auth/register_controller')
const SessionController = () => import('#controllers/auth/session_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'I am alive',
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
  })
  .use(middleware.auth())
  .as('user-routes')
  .prefix('api')
