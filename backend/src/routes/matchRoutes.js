const router = require('express').Router();

const matchController = require('../controllers/matchController');
const { requireFields } = require('../middleware/validate');

router.post('/', requireFields('briefId'), matchController.create);
router.get('/:briefId', matchController.getOne);

module.exports = router;
