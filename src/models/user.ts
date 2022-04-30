import bcrypt from 'bcryptjs'

import { mongoose } from '../database'

import { CommonProps } from './common'

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    enable: {
      type: Boolean,
      trim: true,
      default: true,
      select: false,
    },
    su: {
      type: Boolean,
      trim: true,
      default: false,
      select: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    products: [
      {
        type: String,
        trim: true,
      },
    ],
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: 6,
    },
    permissions: [
      {
        _id: false,
        screen: {
          type: String,
          trim: true,
          required: [true, 'Permissões são obrigatórias'],
          default: [
            {
              screen: '/',
            },
            {
              screen: '/products/items',
            },
            {
              screen: '/favorites',
            },
          ],
        },
      },
    ],
    refreshToken: {
      type: String,
      trim: true,
      select: false,
    },
    code: {
      number: {
        type: Number,
        trim: true,
        select: false,
      },
      date: {
        type: Number,
        trim: true,
        select: false,
      },
    },
    ...CommonProps,
  },
  {
    versionKey: false,
  }
)

User.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)

  this.password = hash

  next()
})

export const UserModel = mongoose.model('user', User)
