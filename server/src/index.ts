import { server, io } from './lib/socket';
const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})