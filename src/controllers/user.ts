import { UserModel } from '../models'
import { NewError } from '../utils'

export const findAll = (query?) => {
  return UserModel.find(query)
}

export const create = async user => {
  const alreadyExists = await findAll({ email: user.email })

  if (alreadyExists.length > 0) {
    throw NewError('User already exists', 400)
  } else {
    return UserModel.create(user)
  }
}

export const updateOne = data => {
  const { _id, ...restData } = data
  return UserModel.updateOne({ _id }, restData, { runValidators: true })
}

export const deleteOne = _id => {
  const data = { _id, enable: false }
  return updateOne(data)
}

export const deleteUser = _id => {
  return UserModel.deleteOne({ _id }, { runValidators: true })
}

export const deleteManyProducts = productId => {
  return UserModel.updateMany(
    {},
    { $pull: { products: productId } },
    { runValidators: true }
  )
}
