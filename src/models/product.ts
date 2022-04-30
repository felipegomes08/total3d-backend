import { mongoose } from '../database'

import { CommonProps } from './common'

export const ProductProps = {
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  folderName: {
    type: String,
    trim: true,
    required: true,
  },
  urlIcon: {
    type: String,
    trim: true,
    required: true,
  },
  ...CommonProps,
}

const Product = new mongoose.Schema(ProductProps, {
  versionKey: false,
})

export const ProductModel = mongoose.model('product', Product)
