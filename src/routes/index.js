const express = require('express');
const router = express.Router();

// Controller
const mainController = require('../controllers/mainController');

// Middlewares
const validateRegister = require('../middlewares/validateRegister');

const guestMiddleware = require('../middlewares/guest');
const authMiddleware = require('../middlewares/auth');

//Rutas de Acceso
router.get('/', mainController.list);

router.get('/login', guestMiddleware, mainController.login);
router.post('/login', mainController.session);

router.get('/register', guestMiddleware, mainController.register);
router.post('/register', validateRegister, mainController.newRecord);

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.render('/', {title: 'logout success!'})
});

module.exports = router;