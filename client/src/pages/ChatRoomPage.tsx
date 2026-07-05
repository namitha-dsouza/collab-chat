import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import socket from '../lib/socket'

interface Message {
  id?: string
  content: string
  email: string
  userId: string
  createdAt: string
}

interface Room {
  id: string
  name: string
}

function ChatRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [typingStatus, setTypingStatus] = useState('')
  const [room, setRoom] = useState<Room | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  let typingTimeout: ReturnType<typeof setTimeout>

  // auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // fetch room info + message history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, messagesRes] = await Promise.all([
          api.get('/api/rooms'),
          api.get(`/api/rooms/${roomId}/messages`)
        ])
        const currentRoom = roomsRes.data.find((r: Room) => r.id === roomId)
        setRoom(currentRoom || null)
        setMessages(messagesRes.data.reverse())
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }
    fetchData()
  }, [roomId])

  // socket events
  useEffect(() => {
    socket.emit('join_room', roomId)

    socket.on('receive_message', (data: Message) => {
  console.log('receive_message data:', data)
  setMessages((prev) => [...prev, data])
})

    socket.on('user_typing', (data: { email: string }) => {
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

  const sendMessage = () => {
    if (!newMessage.trim()) return
    socket.emit('send_message', { roomId, content: newMessage })
    setNewMessage('')
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    socket.emit('typing_start', roomId)
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      socket.emit('typing_stop', roomId)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div
            className="auth-logo-icon"
            style={{ width: 28, height: 28, fontSize: 14, borderRadius: 6, cursor: 'pointer' }}
            onClick={() => navigate('/rooms')}
          >
            💬
          </div>
          <span className="workspace-name">CollabChat</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-label">Channels</p>
          <div
            className={`room-item active`}
          >
            <span className="hash">#</span>
            {room?.name || 'Loading...'}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '0.75rem' }}>
          <button
            className="btn btn-sm"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', width: '100%' }}
            onClick={() => navigate('/rooms')}
          >
            ← All channels
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="main-content">
        <div className="chat-header">
          <span className="hash">#</span>
          <span className="room-title">{room?.name || 'Loading...'}</span>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state" style={{ flex: 1 }}>
              <span className="icon">👋</span>
              <p>This is the beginning of <strong>#{room?.name}</strong></p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Send a message to get started</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={msg.id || index} className="message">
              <div className="message-header">
                <span className="message-author">{msg.email?.split('@')[0]}</span>
                <span className="message-time">{formatTime(msg.createdAt)}</span>
              </div>
              <p className="message-content">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="typing-indicator">{typingStatus}</div>

        <div className="message-input-area">
          <div className="message-input-wrapper">
            <input
              className="message-input"
              type="text"
              placeholder={`Message #${room?.name || '...'}`}
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              Send ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoomPage
