import app from '../app'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

export { io, server }