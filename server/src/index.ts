import prisma from './lib/prisma';
import { server, io } from './lib/socket';
const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`${socket.data.user.email} joined room ${roomId}`)

    socket.to(roomId).emit('user_joined', {
      userId: socket.data.user.id,
      email: socket.data.user.email
    })
  })

 socket.on('send_message', async ({ roomId, content }) => {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        userId: socket.data.user.id,
        roomId
      }
    })

    io.to(roomId).emit('receive_message', {
      userId: socket.data.user.id,
      email: socket.data.user.email,
      content,
      createdAt: message.createdAt
    })
  } catch (error) {
    console.error('Error saving message:', error)
    socket.emit('message_error', { message: 'Failed to send message' })
  }
});
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})