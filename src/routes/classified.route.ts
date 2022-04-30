import { Router } from 'express'

import { RequestCustom } from '../@types'
import { classifiedController } from '../controllers'

const classifiedRoute = Router()

classifiedRoute.get('/', async (req: RequestCustom, res) => {
  const data = await classifiedController.findAll()

  return res.json(data)
})

classifiedRoute.get('/:_id', async (req: RequestCustom, res) => {
  const { _id } = req.params
  const data = await classifiedController.findAll({ _id })

  return res.json(data[0])
})

classifiedRoute.post('/', async (req: RequestCustom, res) => {
  const { title, description, type, price, name, whatsapp, instagram, email } = req.body

  const data = await classifiedController.create({
    userId: req.user._id,
    title,
    description,
    type,
    price,
    name,
    whatsapp,
    instagram,
    email,
  })

  return res.json(data)
})

classifiedRoute.put('/:_id', async (req, res) => {
  const { _id } = req.params
  const { title, description, type, price, name, whatsapp, instagram, email } = req.body

  const data = await classifiedController.updateOne({
    _id,
    title,
    description,
    type,
    price,
    name,
    whatsapp,
    instagram,
    email,
  })

  return res.json(data)
})

classifiedRoute.delete('/:_id', async (req, res) => {
  const { _id } = req.params

  const data = await classifiedController.deleteOne(_id)

  return res.json(data)
})

export { classifiedRoute }
