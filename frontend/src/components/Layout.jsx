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
                  <span style={{ color: '#475569' }}>{user?.name}</span>
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
