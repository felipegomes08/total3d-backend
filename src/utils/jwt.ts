import jwt from 'jsonwebtoken'

import { NewError } from './error'

export const sign = (payload, expiresIn?: string) => {
  const token = jwt.sign({ ...payload }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: expiresIn || '4m',
    algorithm: 'RS256',
  })

  return token
}

export const verify = token =>
  new Promise<any>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_PUBLIC_KEY, async (err, decoded) => {
      try {
        if (err) {
          reject(NewError('Token error', 400))
        } else {
          resolve(decoded)
        }
      } catch (error) {
        reject(NewError(error.message, 400))
      }
    })
  })
