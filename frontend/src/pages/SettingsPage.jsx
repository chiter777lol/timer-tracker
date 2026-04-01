import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import Input from '../components/Input'
import Button from '../components/Button'
import styles from '../styles/Profile.module.css'
import toast from 'react-hot-toast'

const SettingsPage = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', theme: user?.theme || 'light' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedUser = { ...user, ...formData }
    dispatch(login(updatedUser))
    localStorage.setItem('user', JSON.stringify(updatedUser))
    toast.success('Настройки сохранены')
  }

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>Настройки аккаунта</h1>
      
      <div className={styles.form}>
        <div className={styles.avatar}>
          <span>{user?.name?.charAt(0)?.toUpperCase() || '���'}</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Input label="Имя" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>Тема оформления</label>
            <div className={styles.themeSelect}>
              <div className{`${styles.themeOption} ${styles.themeLight} ${formData.theme === 'light' ? styles.active : ''}`} onClick={() => setFormData({ ...formData, theme: 'light' })}>Светлая</div>
              <div className={`${styles.themeOption} ${styles.themeDark} ${formData.theme === 'dark' ? styles.active : ''}`} onClick={() => setFormData({ ...formData, theme: 'dark' })}>Темная</div>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <Button type="submit">Сохранить настройки</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default SettingsPage
