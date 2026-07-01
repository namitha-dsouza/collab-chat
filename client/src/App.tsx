import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import RoomListPage from './pages/RoomListPage'
import ProtectedRoute from './components/ProtectedRoute'
import ChatRoomPage from './pages/ChatRoomPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rooms" element={
          <ProtectedRoute>
            <RoomListPage />
          </ProtectedRoute>
        } />
        <Route path="/rooms/:roomId" element={
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App