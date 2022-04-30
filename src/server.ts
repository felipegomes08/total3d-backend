import 'express-async-errors'
import cors from 'cors'
import express from 'express'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import morgan from 'morgan'

import { app, serverHttp } from './http'
import { authMiddleware } from './middlewares'
import {
  authRoute,
  usersRoute,
  productsRoute,
  livesRoute,
  userFavoritesRoute,
  classifiedRoute,
} from './routes'

import './websocket'

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  })

serverHttp.listen(process.env.PORT || 3333, () => {
  // eslint-disable-next-line no-console
  console.log(`> Server running on port ${process.env.PORT || 3333}`)
})

app.use(middleware.handle(i18next))
app.use(
  cors({
    origin: '*',
  })
)
app.use(express.json())

app.use(morgan('dev'))

// app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/users', usersRoute)
app.use('/users-favorite', authMiddleware, userFavoritesRoute)
app.use('/auth', authRoute)
app.use('/products', authMiddleware, productsRoute)
app.use('/lives', authMiddleware, livesRoute)
app.use('/classified', authMiddleware, classifiedRoute)

app.get('/', (req, res) => {
  return res.send('Ok')
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, _) => {
  return res.status(error.statusCode || 406).json({ error: req.t(error.message) })
})
