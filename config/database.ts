import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DATABASE_URL') || 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('PGHOST'),
        port: env.get('PGPORT'),
        user: env.get('PGUSER'),
        password: env.get('PGPASSWORD'),
        database: env.get('PGDATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
