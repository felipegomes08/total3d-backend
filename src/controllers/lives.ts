import { LiveModel } from '../models'
import { NewError } from '../utils'

export const findAll = (query?) => {
  return LiveModel.find(query)
}

export const create = async live => {
  const alreadyExists = await findAll({ url: live.url })

  if (alreadyExists.length > 0) {
    throw NewError('Live already exists', 400)
  } else {
    return LiveModel.create(live)
  }
}

export const updateOne = live => {
  const { _id, ...restData } = live

  return LiveModel.updateOne({ _id }, restData)
}

export const deleteOne = _id => {
  return LiveModel.deleteOne({ _id })
}
