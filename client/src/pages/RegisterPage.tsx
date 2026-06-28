import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

function RegisterPage() {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()   
  setError('')         

  try {
    await api.post('/auth/register', { userName, email, password })
    navigate('/login')   
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    setError(axiosError.response?.data?.message || 'Registration failed')
  }
}

  return (
    <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Username"
    value={userName}
    onChange={(e) => setUserName(e.target.value)}
  />
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  {error && <p style={{ color: 'red' }}>{error}</p>}
  <button type="submit">Register</button>
</form>
  )
}

export default RegisterPage