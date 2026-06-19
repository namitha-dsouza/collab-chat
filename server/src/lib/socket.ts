import app from '../app'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken';
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.use((socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
        return next(new Error("Unauthorized: No token provided"))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        socket.data.user = decoded as { id: string; email: string }
        next()
    } catch (error) {
        next(new Error("Unauthorized: Invalid token"))
    }
})
export { io, server }