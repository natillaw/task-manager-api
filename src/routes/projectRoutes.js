const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.use(verifyToken);

router.get('/', listProjects);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', requireRole('ADMIN'), deleteProject);

module.exports = router;