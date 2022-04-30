import { ProductModel } from '../models'
import { NewError } from '../utils'

import { userController } from '.'

export const findAll = (query?) => {
  return ProductModel.find(query)
}

export const create = async product => {
  const alreadyExists = await findAll({ folderName: product.folderName })

  if (alreadyExists.length > 0) {
    throw NewError('Product already exists', 400)
  } else {
    return ProductModel.create(product)
  }
}

export const updateOne = product => {
  const { _id, ...restData } = product

  return ProductModel.updateOne({ _id }, restData)
}

export const deleteOne = async ProductId => {
  await userController.deleteManyProducts(ProductId)
  return ProductModel.deleteOne({ _id: ProductId })
}
