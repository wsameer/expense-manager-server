/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import User from '#models/user'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'Jimbu is the best',
  }
})

router.get('/users', async () => {
  return User.all()
})
