import styles from '../styles/Button.module.css'

const Button = ({ children, variant = 'primary', size = 'medium', onClick, type = 'button', disabled = false }) => {
  const sizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : ''
  return (
    <button type={type} className={`${styles.btn} ${styles[variant]} ${sizeClass}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
export default Button
