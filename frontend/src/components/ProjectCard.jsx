import styles from '../styles/ProjectList.module.css'
import Button from './Button'
const ProjectCard = ({ project, onEdit, onDelete }) => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a']
  const colorIndex = (project._id?.charAt(project._id.length - 1)?.charCodeAt(0) || 0) % colors.length
  return (
    <div className={styles.projectCard} style={{ borderLeftColor: colors[colorIndex] }}>
      <h3 className={styles.projectName}>{project.name}</h3>
      {project.description && <p className={styles.projectDesc}>{project.description}</p>}
      <div className={styles.projectActions}>
        <span className={styles.editBtn} onClick={() => onEdit(project)}>✏️ Редактировать</span>
        <span className={styles.deleteBtn} onClick={() => onDelete(project._id)}>��� Удалить</span>
      </div>
    </div>
  )
}
export default ProjectCard
