const router = require('express').Router();

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { requireFields, requireEmail } = require('../middleware/validate');

router.post('/register', requireFields('name', 'email', 'password'), requireEmail, authController.register);
router.post('/login', requireFields('email', 'password'), requireEmail, authController.login);
router.get('/me', requireAuth, authController.me);

module.exports = router;
