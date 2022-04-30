import { Router } from 'express'

import { RequestCustom } from '../@types'
import { userFavoriteController } from '../controllers'

const userFavoritesRoute = Router()

userFavoritesRoute.get('/', async (req: RequestCustom, res) => {
  const { _id } = req.user

  const data = await userFavoriteController.findAll({ _id })

  return res.send(data)
})

userFavoritesRoute.post('/', async (req: RequestCustom, res) => {
  const { directoryOfImage } = req.body

  const data: any = await userFavoriteController.updateOne(req.user._id, directoryOfImage)

  if (data?.status === 200) {
    return res.json({ message: data.message })
  }

  return res.status(data?.status || 200).json({ message: data?.message })
})

userFavoritesRoute.delete('/:directory', async (req: RequestCustom, res) => {
  const { directory } = req.params

  const data = await userFavoriteController.deleteOne(req.user._id, directory)

  return res.json(data)
})

export { userFavoritesRoute }
