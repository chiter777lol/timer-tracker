import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from '../api'
import ProjectCard from '../components/ProjectCard'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import styles from '../styles/ProjectList.module.css'
import toast from 'react-hot-toast'

const ProjectsPage = () => {
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

  const handleDelete = async (id) => {
    if (confirm('Удалить проект?')) {
      await projectApi.delete(id)
      queryClient.invalidateQueries(['projects'])
      toast.success('Проект удален')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a' }}>Проекты</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Добавить проект</Button>
      </div>

      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p>У вас пока нет проектов</p>
          <Button onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>Создать первый проект</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} onEdit={(p) => { setEditingProject(p); setFormData(p); setIsModalOpen(true) }} onDelete={handleDelete} />
          ))}
        </div>
      )}

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
export default ProjectsPage
