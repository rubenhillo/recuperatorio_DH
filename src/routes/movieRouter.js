const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

//router.get('/', moviesController.home);  
router.get('/', moviesController.list);
router.get('/movies/detail/:id', moviesController.detail);

//Rutas del CRUD
router.get('/movies/add', moviesController.add);
router.post('/movies/create', moviesController.create);
router.get('/movies/edit/:id', moviesController.edit);
router.put('/movies/update/:id', moviesController.update);
router.get('/movies/delete/:id', moviesController.delete);
router.delete('/movies/delete/:id', moviesController.destroy);
//Rutas de Acceso
router.get('/login', moviesController.login);
router.get('/register', moviesController.register);

module.exports = router;