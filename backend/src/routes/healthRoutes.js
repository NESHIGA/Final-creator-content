const router = require('express').Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.health);

module.exports = router;
