import { userController } from '../controllers'
import { jwt, NewError } from '../utils'

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).send({ error: 'Token missing' })
    }

    const parts = authHeader.split('Bearer ')
    if (parts.length !== 2) {
      return res.status(401).send({ error: 'Bearer missing', parts })
    }

    const [, token] = parts

    await jwt.verify(token).then(async decoded => {
      if (decoded?.type === 'rt' || decoded?.type === 'verify') {
        throw NewError('Not permitted to use this token', 400)
      }

      const user = await userController
        .findAll({ _id: decoded.user._id, enable: true })
        .select('+enable')

      if (user.length > 0) {
        req.user = { ...decoded.user, iat: decoded.iat, exp: decoded.exp }
        next()
      } else {
        throw NewError('Operation not allowed', 400)
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ errorAuthMiddleware: error })
    return res.status(401).send({ error: error.message })
  }
}

export const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshTokenHeader = req.headers?.['x-refresh-token']

    if (!refreshTokenHeader) {
      return res.status(401).send({ error: 'Refresh token missing' })
    }

    const parts = refreshTokenHeader.split('Bearer ')

    if (parts.length !== 2) {
      return res.status(401).send({ error: 'Bearer missing' })
    }

    const [, refreshToken] = parts

    req.refreshToken = refreshToken

    next()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log({ errorAuthMiddleware: error })
    return res.status(401).send({ error: error.message })
  }
}
