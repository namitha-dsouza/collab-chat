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
      } catch (err) {
        setError('Failed to fetch rooms')
      }
    }
    fetchRooms()
  }, [])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/api/rooms', { name: newRoomName })
      setRooms([response.data, ...rooms])
      setNewRoomName('')
    } catch (err) {
      setError('Failed to create room')
    }
  }

  return (
    <div>
      <h1>Rooms</h1>
      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.id} onClick={() => navigate(`/rooms/${room.id}`)}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RoomListPage