import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { authApi } from '../api'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(formData)
      localStorage.setItem('token', res.data.token)
      dispatch(login(res.data.user))
      toast.success('Добро пожаловать!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка входа')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '4rem' }}>
      <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', marginBottom: '1.5rem', color: '#0f172a' }}>Вход</h1>
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Пароль" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>{loading ? 'Вход...' : 'Войти'}</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          Нет аккаунта? <Link to="/register" style={{ color: '#6366f1' }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
export default LoginPage
