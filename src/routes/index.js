const express = require('express');
const router = express.Router();

const taskRoutes = require('./taskRoutes');

router.get('/', (req, res) => {
  res.render('home/index', { title: 'Aspirely Home' });
});

router.use('/api/tasks', taskRoutes);

module.exports = router;
