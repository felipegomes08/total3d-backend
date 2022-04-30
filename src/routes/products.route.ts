import { Router } from 'express'

import { RequestCustom } from '../@types'
import { productsController, awsController, userController } from '../controllers'
import { admMiddleware } from '../middlewares'
import { NewError } from '../utils'

const productsRoute = Router()

productsRoute.get('/', async (req: RequestCustom, res) => {
  const { _id } = req.user

  const [{ products }] = await userController.findAll({ _id: _id })

  const data = []

  const allProducts = await productsController.findAll().lean()

  for (const product of allProducts) {
    if (products.indexOf(product._id.toString()) < 0) {
      data.push({ ...product, disabled: true })
    } else {
      data.push({ ...product, disabled: false })
    }
  }

  return res.json(data)
})

productsRoute.get('/:userId', async (req: RequestCustom, res) => {
  const userId = req.params.userId

  const [{ products }] = await userController.findAll({ _id: userId })

  const data = []

  const allProducts = await productsController.findAll().lean()

  for (const product of allProducts) {
    if (products.indexOf(product._id.toString()) < 0) {
      data.push({ ...product, disabled: true })
    } else {
      data.push({ ...product, disabled: false })
    }
  }

  return res.json(data)
})

productsRoute.post('/items', async (req: RequestCustom, res) => {
  const { nct } = req.body
  let { path } = req.body

  const user = req.user

  const userData = await userController.findAll({ _id: user._id })

  const products: string[] = []

  for await (const productId of userData[0]?.products) {
    const product = await productsController.findAll({ _id: productId })

    products.push(product[0].folderName)
  }

  if (!path.endsWith('/')) {
    path += '/'
  }

  const folderName = products.find(product => product.includes(path.split('/')[0] + '/'))

  if (!folderName) {
    throw NewError('Você não têm permissão para acessar esta pasta', 400)
  }

  const data = await awsController.s3.findFilesOrFolders(path, nct)

  return res.json(data)
})

productsRoute.post('/', admMiddleware, async (req, res) => {
  let { name, description, folderName, urlIcon } = req.body

  if (!folderName.endsWith('/')) {
    folderName += '/'
  }

  const created = await productsController.create({
    name,
    description,
    folderName,
    urlIcon,
  })

  return res.json(created)
})

productsRoute.put('/:_id', admMiddleware, async (req, res) => {
  const { _id } = req.params
  const { name, description, url } = req.body

  const created = await productsController.updateOne({
    _id,
    name,
    description,
    url,
  })

  return res.json(created)
})

productsRoute.delete('/:_id', admMiddleware, async (req, res) => {
  const { _id } = req.params

  const created = await productsController.deleteOne(_id)

  return res.json(created)
})

export { productsRoute }
