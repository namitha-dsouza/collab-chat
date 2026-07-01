import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import socket from '../lib/socket'

interface Message {
  id: string
  content: string
  email: string
  userId: string
  createdAt: string
}

function ChatRoomPage() {
  const { roomId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [typingStatus, setTypingStatus] = useState('')
  let typingTimeout: ReturnType<typeof setTimeout>

  // fetch message history on load
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await api.get(`/api/rooms/${roomId}/messages`)
      setMessages(response.data.reverse()) // reverse because we get newest first
    }
    fetchMessages()
  }, [roomId])
// socket events
useEffect(() => {
  socket.emit('join_room', roomId)

  socket.on('receive_message', (data) => {
    setMessages((prev) => [...prev, data])
  })

  socket.on('user_typing', (data) => {
    setTypingStatus(`${data.email} is typing...`)
  })

  socket.on('user_stopped_typing', () => {
    setTypingStatus('')
  })

  return () => {
    socket.emit('leave_room', roomId)
    socket.off('receive_message')
    socket.off('user_typing')
    socket.off('user_stopped_typing')
  }
}, [roomId])

// send message function
const sendMessage = () => {
  if (!newMessage.trim()) return
  socket.emit('send_message', { roomId, content: newMessage })
  setNewMessage('')
}

// typing handler
const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewMessage(e.target.value)
  socket.emit('typing_start', roomId)
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    socket.emit('typing_stop', roomId)
  }, 1000)
}
  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}><b>{msg.email}:</b> {msg.content}</p>
        ))}
      </div>
      <p>{typingStatus}</p>
      <input
  value={newMessage}
  onChange={handleTyping}
  placeholder="Type a message"
/>
<button onClick={sendMessage}>Send</button>
      
    </div>
  )
}

export default ChatRoomPage