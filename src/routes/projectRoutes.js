const router = require('express').Router();

const projectController = require('../controllers/projectController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

router.get('/', requireAuth, projectController.list);
router.get('/:id', requireAuth, projectController.getOne);
router.post(
  '/',
  requireAuth,
  requireRole('brand', 'admin'),
  requireFields('creatorId'),
  projectController.create
);
router.patch('/:id', requireAuth, projectController.update);
router.delete('/:id', requireAuth, projectController.remove);

module.exports = router;
