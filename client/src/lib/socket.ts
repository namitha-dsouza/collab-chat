import { io } from 'socket.io-client'

const token = localStorage.getItem('token')

const socket = io('http://localhost:4000', {
  auth: {
    token: token    
  }
})

export default socket