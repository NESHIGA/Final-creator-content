const router = require('express').Router();

const matchController = require('../controllers/matchController');
const { requireAuth } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

router.post('/', requireAuth, requireFields('briefId'), matchController.create);
router.get('/:briefId', requireAuth, matchController.getOne);

module.exports = router;
