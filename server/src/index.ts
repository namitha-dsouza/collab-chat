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
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})