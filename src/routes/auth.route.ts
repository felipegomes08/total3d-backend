import bcrypt from 'bcryptjs'
import { Router } from 'express'

import { RequestCustom } from '../@types'
import { emailController, productsController, userController } from '../controllers'
import { admMiddleware, authMiddleware, refreshTokenMiddleware } from '../middlewares'
import { jwt, NewError } from '../utils'

const authRoute = Router()

authRoute.post('/signIn', async (req: RequestCustom, res) => {
  const { email, password } = req.body

  const alreadyExists = await userController
    .findAll({ email })
    .select('+password +su +enable')
    .lean()

  if (!alreadyExists[0].enable) {
    throw NewError('Usuário desabilitado', 401)
  }

  if (!(await bcrypt.compare(password, alreadyExists[0].password))) {
    throw NewError('Email or password is incorrect', 400)
  }

  alreadyExists[0].password = undefined

  const token = jwt.sign({ user: alreadyExists[0] })

  const refreshToken = jwt.sign({ user: alreadyExists[0], type: 'rt' }, '365d')

  alreadyExists[0].su = undefined

  await userController.updateOne({
    _id: alreadyExists[0]._id,
    refreshToken: refreshToken,
  })

  return res.json({ user: alreadyExists[0], token, refreshToken })
})

authRoute.post(
  '/signUp',
  authMiddleware,
  admMiddleware,
  async (req: RequestCustom, res) => {
    const { name, email, password, products } = req.body
    const userCreated = await userController.create({
      name,
      email,
      password,
      products,
      permissions: [
        {
          screen: '/',
        },
        {
          screen: '/products/items',
        },
        {
          screen: '/favorites',
        },
      ],
    })
    const allProducts = await productsController.findAll()

    if (products?.length > allProducts?.length) {
      throw NewError('Quantity of products not allowed', 400)
    }

    userCreated.password = undefined
    userCreated.createdAt = undefined
    userCreated.updatedAt = undefined
    userCreated.enable = undefined
    userCreated.su = undefined

    return res.json(userCreated)
  }
)

authRoute.post(
  '/refresh-token',
  refreshTokenMiddleware,
  async (req: RequestCustom, res) => {
    const refreshToken = req.refreshToken

    const jwtDecoded = await jwt.verify(refreshToken)

    if (jwtDecoded?.type !== 'rt') {
      throw NewError('Not permitted to use this token', 400)
    }

    const alreadyExists = await userController
      .findAll({
        _id: jwtDecoded.user._id,
        rt: refreshToken,
      })
      .select('+su +enable')

    const token = jwt.sign({ user: alreadyExists[0] })

    const newRefreshToken = jwt.sign({ user: alreadyExists[0], type: 'rt' }, '365d')

    await userController.updateOne({
      _id: alreadyExists[0]._id,
      refreshToken: newRefreshToken,
    })

    if (alreadyExists.length > 0) {
      return res.json({ user: alreadyExists[0], token, refreshToken: newRefreshToken })
    }

    throw NewError('Token dont match to user', 400)
  }
)

authRoute.post('/send-code', async (req, res) => {
  const { email } = req.body

  const data = await userController.findAll({ email, enabled: true })

  if (data.length === 0) {
    throw NewError('Operation not permitted', 400)
  }

  const code = emailController.generateCode()

  const sentSuccess = emailController.sendMailRecovery(data[0].email, data[0].name, code)

  if (sentSuccess) {
    const date = new Date()

    const updated = await userController.updateOne({
      _id: data[0]._id,
      code: {
        date: date.getTime() + 1000 * 60 * 15,
        number: code,
      },
    })

    return res.json(updated)
  }
})

authRoute.post('/verify-code', async (req, res) => {
  const { email, code } = req.body

  const data = await userController.findAll({ email, enabled: true }).select({ code: 1 })

  if (data.length === 0) {
    throw NewError('Operation not permitted', 400)
  }

  const date = new Date()

  if (data[0].code.date < date) {
    throw NewError('Code expired, please try again', 400)
  } else {
    if (data[0].code.number === code) {
      return res.json({ message: 'Code is valid' })
    } else {
      throw NewError('Code is incorrect', 400)
    }
  }
})

authRoute.post('/update-pass', async (req, res) => {
  const { email, code, newPassword } = req.body

  const data = await userController
    .findAll({ email, enabled: true })
    .select({ _id: 1, code: 1 })

  if (data.length === 0) {
    throw NewError('Operation not permitted', 400)
  }

  const date = new Date()

  if (data[0].code.date < date) {
    throw NewError('Code expired, please try again', 400)
  } else {
    if (data[0].code.number === code) {
      const password = await bcrypt.hash(newPassword, 10)

      const updated = await userController.updateOne({
        _id: data[0]._id,
        password,
      })

      return res.json(updated)
    } else {
      throw NewError('Code is incorrect', 400)
    }
  }
})

export { authRoute }
