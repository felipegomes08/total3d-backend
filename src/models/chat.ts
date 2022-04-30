import { mongoose } from '../database'

import { CommonProps } from './common'

const Chat = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        userId: {
          type: String,
          trim: true,
          required: true,
        },
        message: {
          type: String,
          trim: true,
          required: true,
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    ...CommonProps,
  },
  {
    versionKey: false,
  }
)

export const ChatModel = mongoose.model('chat', Chat)
