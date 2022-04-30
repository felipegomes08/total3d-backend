import { mongoose } from '../database'

import { CommonProps } from './common'

const UserFavorite = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    directoryOfImages: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    ...CommonProps,
  },
  {
    versionKey: false,
  }
)

export const UserFavoriteModel = mongoose.model('user_favorite', UserFavorite)
