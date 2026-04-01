const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/sessions - получить сессии пользователя с фильтрацией
router.get('/', auth, async (req, res) => {
  try {
    let query = { userId: req.user.id };
    
    if (req.query.projectId) {
      query.projectId = req.query.projectId;
    }
    if (req.query.startDate) {
      query.startTime = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.endTime = { $lte: new Date(req.query.endDate) };
    }
    
    let sessions = await Session.find(query).populate('projectId').sort({ startTime: -1 });
    
    // Пагинация
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedSessions = sessions.slice(startIndex, endIndex);
    const total = sessions.length;
    
    res.json({
      sessions: paginatedSessions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sessions/start - начать сессию
router.post('/start', auth, async (req, res) => {
  try {
    const { projectId, note } = req.body;
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }
    
    // Проверяем, есть ли активная сессия
    const activeSession = await Session.findOne({ userId: req.user.id, isActive: true });
    if (activeSession) {
      return res.status(400).json({ message: 'У вас уже есть активная сессия' });
    }
    
    const session = new Session({
      projectId,
      userId: req.user.id,
      startTime: new Date(),
      note,
      isActive: true
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/sessions/:id/stop - остановить сессию
router.put('/:id/stop', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) {
      return res.status(404).json({ message: 'Сессия не найдена' });
    }
    
    session.endTime = new Date();
    session.duration = Math.round((session.endTime - session.startTime) / 60000);
    session.isActive = false;
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/sessions/active - получить активную сессию
router.get('/active', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ userId: req.user.id, isActive: true }).populate('projectId');
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/sessions/stats - статистика
router.get('/stats', auth, async (req, res) => {
  try {
    const { projectId, period = 'week' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }
    
    let query = { userId: req.user.id, startTime: { $gte: startDate }, isActive: false };
    if (projectId) {
      query.projectId = projectId;
    }
    
    const sessions = await Session.find(query).populate('projectId');
    
    // Группировка по дням
    const dailyStats = {};
    sessions.forEach(session => {
      const day = session.startTime.toISOString().split('T')[0];
      if (!dailyStats[day]) dailyStats[day] = 0;
      dailyStats[day] += session.duration;
    });
    
    // Статистика по проектам
    const projectStats = {};
    sessions.forEach(session => {
      const projectName = session.projectId?.name || 'Неизвестно';
      if (!projectStats[projectName]) projectStats[projectName] = 0;
      projectStats[projectName] += session.duration;
    });
    
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    
    res.json({
      daily: dailyStats,
      byProject: projectStats,
      total: totalTime,
      sessionsCount: sessions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
