import { Request } from 'express'

export type RequestCustom = Request & {
  user: {
    _id: string
  }
  refreshToken: string
  body: {
    [key: string]: any
  }
}
