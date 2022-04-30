import { ClassifiedModel } from '../models'

export const findAll = (query?) => {
  return ClassifiedModel.find(query)
}

export const create = async classified => {
  return ClassifiedModel.create(classified)
}

export const updateOne = classified => {
  const { _id, ...restData } = classified

  return ClassifiedModel.updateOne({ _id }, restData)
}

export const deleteOne = _id => {
  return ClassifiedModel.deleteOne({ _id })
}
