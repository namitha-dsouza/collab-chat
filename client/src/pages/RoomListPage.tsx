import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Room {
  id: string
  name: string
  createdAt: string
}

function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/api/rooms')
        setRooms(response.data)
      } catch {
        setError('Failed to fetch rooms')
      }
    }
    fetchRooms()
  }, [])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return
    try {
      const response = await api.post('/api/rooms', { name: newRoomName })
      setRooms([response.data, ...rooms])
      setNewRoomName('')
    } catch {
      setError('Failed to create room')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="auth-logo-icon" style={{ width: 28, height: 28, fontSize: 14, borderRadius: 6 }}>💬</div>
          <span className="workspace-name">CollabChat</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-label">Channels</p>
          {rooms.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '0.5rem' }}>
              No rooms yet
            </div>
          )}
          {rooms.map((room) => (
            <div
              key={room.id}
              className="room-item"
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              <span className="hash">#</span>
              {room.name}
            </div>
          ))}
        </div>

        <form className="create-room-form" onSubmit={handleCreateRoom}>
          <input
            className="input"
            type="text"
            placeholder="New channel"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button className="btn-icon" type="submit" title="Create channel">+</button>
        </form>
      </div>

      <div className="main-content">
        <div className="empty-state">
          <span className="icon">💬</span>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Select a channel to start chatting</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>or create a new one from the sidebar</p>
          {error && <p className="error-msg">{error}</p>}
          <button
            className="btn btn-sm"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', marginTop: '1rem' }}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomListPage
