import { mongoose } from '../database'

import { CommonProps } from './common'

const Live = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
    ...CommonProps,
  },
  {
    versionKey: false,
  }
)

export const LiveModel = mongoose.model('live', Live)
