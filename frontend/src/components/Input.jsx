import styles from '../styles/Input.module.css'
const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, textarea = false }) => {
  const Component = textarea ? 'textarea' : 'input'
  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
      <Component type={type} className={textarea ? styles.textarea : styles.input} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  )
}
export default Input
