import { UserFavoriteModel } from '../models'
import { functions } from '../utils'

import { s3 } from './aws'

export const findAll = async (query?) => {
  const filesArray = await UserFavoriteModel.find(query)

  const array = filesArray[0].directoryOfImages.map(file => {
    return {
      image: file,
      download: functions.removeExtensionFromFile(file) + '.rar',
    }
  })

  return await s3.generateUrlFromFiles(array)
}

export const findOne = async (_id: string) => {
  return await UserFavoriteModel.findOne({ _id }).lean()
}

export const deleteOne = (_id: string, directory: string) => {
  return UserFavoriteModel.updateOne(
    { _id },
    { $pull: { directoryOfImages: directory } },
    { runValidators: true }
  )
}

export const updateOne = async (_id: string, directory: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alreadyExists: any = await findOne(_id)

  if (!alreadyExists?._id) {
    return UserFavoriteModel.create({ _id, directoryOfImages: [directory] }).then(() => {
      return {
        message: 'Added from favorites',
        status: 201,
      }
    })
  }

  if (
    alreadyExists?.directoryOfImages?.length &&
    alreadyExists?.directoryOfImages?.indexOf(directory) >= 0
  ) {
    const res = await deleteOne(_id, directory)
    if (res.modifiedCount > 0) {
      return {
        message: 'Removed from favorites',
      }
    }
  } else {
    return UserFavoriteModel.updateOne(
      { _id },
      { $addToSet: { directoryOfImages: directory } },
      { runValidators: true }
    ).then(res => {
      if (res.modifiedCount > 0) {
        return {
          message: 'Added from favorites',
          status: 201,
        }
      } else {
        throw new Error('Erro ao adicionar aos favoritos')
      }
    })
  }
}
