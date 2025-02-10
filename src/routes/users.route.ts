import { Router } from 'express'

import { productsController, userController } from '../controllers'
import { admMiddleware, authMiddleware } from '../middlewares'
import { jwt, NewError } from '../utils'
import { pagination } from '../utils/functions'

const usersRoute = Router()

usersRoute.get('/', authMiddleware, admMiddleware, async (req, res) => {
  const page = parseInt(req.query.page?.toString())
  const limit = parseInt(req.query.limit?.toString())
  const text = req.query?.text

  if (text) {
    const data = await userController
      .findAll()
      .or([
        { name: { $regex: text, $options: 'i' } },
        { email: { $regex: text, $options: 'i' } },
      ])

    const dataFiltered = pagination(data, page || 1, limit || 25)

    return res.json(dataFiltered)
  } else if (page) {
    const data = await userController.findAll().select('+enable')

    const dataFiltered = pagination(data, page, limit)

    return res.json(dataFiltered)
  } else {
    const data = await userController.findAll()

    return res.json(data)
  }
})

usersRoute.get('/:_id', authMiddleware, async (req, res) => {
  const { _id } = req.params

  const data = await userController.findAll({ _id })

  return res.json(data[0])
})

usersRoute.get('/verify/:_id', async (req, res) => {
  const { _id } = req.params
  const data = await userController.findAll({ _id }).select('+enable +su')

  const token = jwt.sign({ user: data[0], type: 'verify' }, '12h')

  return res.json(token)
})

usersRoute.put('/status/:_id', authMiddleware, admMiddleware, async (req, res) => {
  const { _id } = req.params
  const { enable } = req.body

  const dataFind = await userController.findAll({ _id, su: true })

  if (dataFind.length < 0) {
    throw NewError('Operation not permitted', 400)
  }

  const dataUpdate = await userController.updateOne({ _id, enable })

  return res.json(dataUpdate)
})

usersRoute.put('/:_id', authMiddleware, admMiddleware, async (req, res) => {
  const { _id } = req.params
  const body = req.body

  if (body.products?.length > 0) {
    for await (const _id of body.products) {
      const item = await productsController.findAll({ _id })

      if (item.length === 0) {
        throw NewError('Product not found', 400)
      }
    }
  }

  const data = await userController.updateOne({
    _id,
    ...body,
  })

  return res.json(data)
})

usersRoute.put('/downloads/:_id', async (req, res) => {
  const { _id } = req.params
  const body = req.body

  if (body.products?.length > 0) {
    for await (const _id of body.products) {
      const item = await productsController.findAll({ _id })

      if (item.length === 0) {
        throw NewError('Product not found', 400)
      }
    }
  }

  const data = await userController.updateOne({
    _id,
    ...body,
  })

  return res.json(data)
})

usersRoute.delete('/:_id', authMiddleware, admMiddleware, async (req, res) => {
  const { _id } = req.params

  const data = await userController.deleteUser(_id)

  return res.json(data)
})

export { usersRoute }
