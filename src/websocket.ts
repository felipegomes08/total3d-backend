import { chatController, userController } from './controllers'
import { io } from './http'

interface RoomUser {
  socket_id: string
  username: string
  room: string
}

interface Message {
  _id: string
  message: string
  createdAt: Date
  userId: string
}

let users: RoomUser[] = []

const login: any = {}

io.on('connection', socket => {
  socket.on('started_live', async ({ _id, title, url }) => {
    try {
      const user = await userController.findAll({ _id, su: true })
      if (user.length > 0) {
        io.emit('notification_lives', {
          title,
          url,
        })
      }
    } catch (error) {
      console.log({ error: error.message })
    }
  })

  socket.on('login', async _id => {
    try {
      const user = await userController.findAll({ _id })

      if (user.length > 0) {
        Object.assign(login, {
          [_id]: 1,
        })
      }

      io.emit('login_limit', {
        _id,
      })
    } catch (error) {
      console.log({ error: error.message })
    }
  })

  // as salas terão o nome formado pelo id do anuncio + id do dono do anuncio + id do cliente
  socket.on('create_chat', async (data, callback) => {
    try {
      if (users.length < 2) {
        socket.join(data.room)

        const userInRoom = users.find(
          user => user.username === data.username && user.room === data.room
        )

        if (userInRoom) {
          userInRoom.socket_id = socket.id
        } else {
          users.push({
            room: data.room,
            username: data.username,
            socket_id: socket.id,
          })
        }
        const [messagesRoom] = await chatController.findAll({ _id: data.room })
        callback(messagesRoom)
      } else {
        console.log({ error: 'create_chat' })
      }
    } catch (error) {
      console.log({ error: error.message })
    }
  })
  console.log(users)

  socket.on('message', async data => {
    try {
      const alreadyExistsInChat = users.find(
        user => user.username === data.username && user.room === data.room
      )

      if (alreadyExistsInChat) {
        console.log({ data })

        const message: Message = {
          _id: data.room,
          message: data.message,
          createdAt: new Date(),
          userId: socket.id,
        }

        await chatController.addMessage(message).catch(error => {
          console.log({ error: error.message })
        })

        io.to(data.room).emit('message', message)
      } else {
        console.log({ errorMessage: data })
      }
    } catch (error) {
      console.log({ error: error.message })
    }
  })

  socket.on('disconnect', data => {
    try {
      const newArrayUsers = users.filter(user => user.socket_id !== socket.id)

      users = [...newArrayUsers]

      console.log(socket.id, data)
    } catch (error) {
      console.log({ error: error.message })
    }
  })
})
