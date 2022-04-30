import { mongoose } from '../database'

import { CommonProps } from './common'

const Classified = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    type: {
      type: String,
      default: true,
      enum: ['ofereço', 'procuro'],
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp: {
      type: Number,
      required: false,
      trim: true,
    },
    instagram: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    ...CommonProps,
  },
  {
    versionKey: false,
  }
)

export const ClassifiedModel = mongoose.model('classified', Classified)
