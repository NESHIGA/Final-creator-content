const router = require('express').Router();

const briefController = require('../controllers/briefController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

router.get('/', requireAuth, briefController.list);
router.get('/:id', requireAuth, briefController.getOne);
router.post('/', requireAuth, requireRole('brand', 'admin'), requireFields('idea'), briefController.create);
router.patch('/:id', requireAuth, briefController.update);
router.delete('/:id', requireAuth, briefController.remove);

module.exports = router;
