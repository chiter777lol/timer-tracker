import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sessionApi, projectApi } from '../api'
import styles from '../styles/Analytics.module.css'

const AnalyticsPage = () => {
  const [filters, setFilters] = useState({ projectId: '', period: 'week', page: 1, limit: 10 })
  
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => projectApi.getAll().then(res => res.data) })
  const { data: stats } = useQuery({ queryKey: ['stats', filters], queryFn: () => sessionApi.getStats(filters).then(res => res.data) })
  const { data: sessionsData } = useQuery({ queryKey: ['sessions', filters], queryFn: () => sessionApi.getAll(filters).then(res => res.data) })

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h} ч ${m} мин` : `${m} мин`
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '1.5rem' }}>Аналитика</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Проект</div>
          <select className={styles.input} value={filters.projectId} onChange={(e) => setFilters({ ...filters, projectId: e.target.value, page: 1 })}>
            <option value="">Все проекты</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Период</div>
          <select className={styles.input} value={filters.period} onChange={(e) => setFilters({ ...filters, period: e.target.value, page: 1 })}>
            <option value="day">День</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
          </select>
        </div>
      </div>

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{formatDuration(stats.total)}</div>
            <div className={styles.statLabel}>Всего времени</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.sessionsCount}</div>
            <div className={styles.statLabel}>Сессий</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{Object.keys(stats.byProject || {}).length}</div>
            <div className={styles.statLabel}>Проектов</div>
          </div>
        </div>
      )}

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>Статистика по проектам</h3>
        {stats?.byProject && Object.keys(stats.byProject).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {Object.entries(stats.byProject).map(([name, minutes]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  <span>{name}</span>
                  <span>{formatDuration(minutes)}</span>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (minutes / (stats.total || 1)) * 100)}%`, background: '#6366f1', height: '0.5rem', borderRadius: '0.5rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Нет данных за выбранный период</p>}
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>История сессий</h3>
        {sessionsData?.sessions?.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sessionsData.sessions.map(s => (
                <div key={s._id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{s.projectId?.name || 'Проект'}</strong>
                    <span style={{ fontSize: '0.875rem', color: '#6366f1' }}>{formatDuration(s.duration)}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(s.startTime).toLocaleString()} — {s.endTime ? new Date(s.endTime).toLocaleString() : 'в процессе'}
                  </div>
                  {s.note && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>��� {s.note}</div>}
                </div>
              ))}
            </div>
            {sessionsData.pages > 1 && (
              <div className={styles.pagination}>
                {[...Array(sessionsData.pages)].map((_, i) => (
                  <button key={i} className={`${styles.pageBtn} ${filters.page === i + 1 ? styles.activePage : ''}`} onClick={() => setFilters({ ...filters, page: i + 1 })}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        ) : <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Нет записей</p>}
      </div>
    </div>
  )
}
export default AnalyticsPage
