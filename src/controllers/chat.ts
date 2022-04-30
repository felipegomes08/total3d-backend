import { ChatModel } from '../models'

export const findAll = (query?) => {
  return ChatModel.find(query)
}

export const addMessage = message => {
  const { _id, ...restData } = message

  return ChatModel.updateOne(
    { _id },
    { $push: { messages: restData } },
    { runValidators: true }
  )
}
