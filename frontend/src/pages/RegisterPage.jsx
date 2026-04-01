import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import { authApi } from '../api'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.register(formData)
      localStorage.setItem('token', res.data.token)
      dispatch(login(res.data.user))
      toast.success('Регистрация успешна!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка регистрации')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '4rem' }}>
      <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', textAlign 'center', marginBottom: '1.5rem', color: '#0f172a' }}>Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <Input label="Имя" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Пароль" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <Input label="Подтвердите пароль" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: '#6366f1' }}>Войти</Link>
        </p>
      </div>
    </div>
  )
}
export default RegisterPage
