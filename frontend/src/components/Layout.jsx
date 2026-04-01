import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import styles from '../styles/Layout.module.css'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>Главная</Link>
            <Link to="/projects" className={`${styles.navLink} ${location.pathname === '/projects' ? styles.active : ''}`}>Проекты</Link>
            <Link to="/analytics" className={`${styles.navLink} ${location.pathname === '/analytics' ? styles.active : ''}`}>Аналитика</Link>
            <Link to="/settings" className={`${styles.navLink} ${location.pathname === '/settings' ? styles.active : ''}`}>Настройки</Link>
            <div className={styles.userMenu}>
              {isAuthenticated ? (
                <>
                  <span>{user?.name}</span>
                  <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.navLink}>Вход</Link>
                  <Link to="/register" className={styles.navLink}>Регистрация</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className={styles.container} style={{ padding: '2rem 1rem' }}>
        <Outlet />
      </main>
    </>
  )
}
export default Layout
EOFcat > pages/HomePage.jsx << 'EOF'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi, sessionApi } from '../api'
import Timer from '../components/Timer'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import styles from '../styles/Card.module.css'
import toast from 'react-hot-toast'

const HomePage = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', color: '#6366f1' })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll().then(res => res.data)
  })

  const handleSubmit = async () => {
    if (!formData.name.trim()) { toast.error('Введите название проекта'); return }
    try {
      if (editingProject) {
        await projectApi.update(editingProject._id, formData)
        toast.success('Проект обновлен')
      } else {
        await projectApi.create(formData)
        toast.success('Проект создан')
      }
      queryClient.invalidateQueries(['projects'])
      setIsModalOpen(false)
      setEditingProject(null)
      setFormData({ name: '', description: '', color: '#6366f1' })
    } catch (err) { toast.error('Ошибка') }
  }

  return (
    <div>
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <h2 className={styles.header}>Текущий таймер</h2>
        <Timer projects={projects} onSessionUpdate={() => queryClient.invalidateQueries(['activeSession'])} />
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className={styles.header}>Мои проекты</h2>
          <Button onClick={() => setIsModalOpen(true)}>+ Новый проект</Button>
        </div>
        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Нет проектов. Создайте первый!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {projects.map(p => (
              <div key={p._id} className={styles.card} style={{ padding: '1rem', borderLeft: `4px solid ${p.color || '#6366f1'}` }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{p.name}</h3>
                {p.description && <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>{p.description}</p>}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setEditingProject(p); setFormData(p); setIsModalOpen(true) }} style={{ color: '#6366f1', cursor: 'pointer', background: 'none', border: 'none' }}>✏️</button>
                  <button onClick={async () => { if (confirm('Удалить проект?')) { await projectApi.delete(p._id); queryClient.invalidateQueries(['projects']) } }} style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}>���</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingProject(null); setFormData({ name: '', description: '', color: '#6366f1' }) }} title={editingProject ? 'Редактировать проект' : 'Новый проект'}>
        <Input label="Название" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Введите название" />
        <Input label="Описание" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Описание (необязательно)" textarea />
        <div style={{ marginTop: '1rem' }}>
          <Button onClick={handleSubmit}>{editingProject ? 'Сохранить' : 'Создать'}</Button>
        </div>
      </Modal>
    </div>
  )
}
export default HomePage
