const router = require('express').Router();

const creatorController = require('../controllers/creatorController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', creatorController.list);
router.get('/:id', creatorController.getOne);
router.post('/', requireAuth, requireRole('creator'), creatorController.create);
router.patch('/:id', requireAuth, requireRole('creator', 'admin'), creatorController.update);
router.delete('/:id', requireAuth, requireRole('creator', 'admin'), creatorController.remove);

module.exports = router;
