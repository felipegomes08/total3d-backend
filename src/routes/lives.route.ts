import { Router } from 'express'

import { livesController } from '../controllers'
import { admMiddleware } from '../middlewares'

const livesRoute = Router()

livesRoute.get('/', admMiddleware, async (req, res) => {
  const data = await livesController.findAll()

  return res.json(data)
})

livesRoute.get('/:_id', admMiddleware, async (req, res) => {
  const { _id } = req.params
  const data = await livesController.findAll({ _id })

  return res.json(data[0])
})

livesRoute.post('/', admMiddleware, async (req, res) => {
  const { title, description, url } = req.body

  const created = await livesController.create({
    title,
    description,
    url,
  })

  return res.json(created)
})

livesRoute.put('/:_id', admMiddleware, async (req, res) => {
  const { _id } = req.params
  const { title, description, url } = req.body

  const created = await livesController.updateOne({
    _id,
    title,
    description,
    url,
  })

  return res.json(created)
})

livesRoute.delete('/:_id', admMiddleware, async (req, res) => {
  const { _id } = req.params

  const created = await livesController.deleteOne(_id)

  return res.json(created)
})

export { livesRoute }
