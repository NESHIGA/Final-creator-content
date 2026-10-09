const router = require('express').Router();

const portfolioController = require('../controllers/portfolioController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

router.get('/', portfolioController.list);
router.get('/:id', portfolioController.getOne);
router.post('/', requireAuth, requireRole('creator'), requireFields('title'), portfolioController.create);
router.patch('/:id', requireAuth, requireRole('creator', 'admin'), portfolioController.update);
router.delete('/:id', requireAuth, requireRole('creator', 'admin'), portfolioController.remove);

module.exports = router;
