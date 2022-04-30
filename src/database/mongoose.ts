/* eslint-disable no-console */
import mongoose from 'mongoose'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('> Connected to db')
  })
  .catch(error => console.log('> Error to connected to db: ', error))

export { mongoose }
