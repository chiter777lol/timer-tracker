import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sessionApi } from '../api'
import { setActiveSession, updateElapsedTime, stopTimer } from '../store/timerSlice'
import toast from 'react-hot-toast'
import styles from '../styles/Timer.module.css'
import Button from './Button'
import Input from './Input'

const Timer = ({ projects, onSessionUpdate }) => {
  const dispatch = useDispatch()
  const { activeSession, elapsedTime, isRunning } = useSelector(state => state.timer)
  const [selectedProject, setSelectedProject] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => dispatch(updateElapsedTime()), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, dispatch])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStart = async () => {
    if (!selectedProject) { toast.error('Выберите проект'); return }
    setLoading(true)
    try {
      const res = await sessionApi.start({ projectId: selectedProject, note })
      dispatch(setActiveSession(res.data))
      toast.success('Время пошло!')
      setNote('')
    } catch (err) { toast.error(err.response?.data?.message || 'Ошибка') }
    setLoading(false)
  }

  const handleStop = async () => {
    if (!activeSession) return
    setLoading(true)
    try {
      await sessionApi.stop(activeSession._id)
      dispatch(stopTimer())
      toast.success('Время сохранено!')
      if (onSessionUpdate) onSessionUpdate()
    } catch (err) { toast.error('Ошибка при остановке') }
    setLoading(false)
  }

  return (
    <div className={styles.timer}>
      <div className={styles.display}>{formatTime(elapsedTime)}</div>
      {!isRunning ? (
        <>
          <select className={styles.projectSelect} value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Выберите проект</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <Input textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Заметка (необязательно)" />
          <div className={styles.controls}>
            <Button onClick={handleStart} disabled={loading || !selectedProject}>{loading ? '...' : 'Начать'}</Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.activeInfo}>
            <strong>{activeSession?.projectId?.name}</strong>
            {activeSession?.note && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>{activeSession.note}</div>}
          </div>
          <div className={styles.controls}>
            <Button variant="danger" onClick={handleStop} disabled={loading}>{loading ? '...' : 'Стоп'}</Button>
          </div>
        </>
      )}
    </div>
  )
}
export default Timer
