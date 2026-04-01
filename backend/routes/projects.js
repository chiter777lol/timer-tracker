const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/projects - получить все проекты пользователя
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/projects - создать проект
router.post('/', auth, async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/projects/:id - обновить проект
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }
    Object.assign(project, req.body);
    project.updatedAt = new Date();
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/projects/:id - удалить проект
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }
    res.json({ message: 'Проект удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
