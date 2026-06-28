import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        try {
            const response = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', response.data.token)
            navigate('/rooms')
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string } } }
            setError(axiosError.response?.data?.message || 'Login failed')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginPage