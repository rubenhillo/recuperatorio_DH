const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const moment = require('moment');
const req = require('express/lib/request');
const { Where } = require('sequelize/types/utils');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {

    
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('movieList.ejs',  {movies}, {title: 'Fun Movies Now'}    )
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include: ['genre'],
                include: ['actors'],
                include: ['actor_movie'],
                where: {
                    [actor_id = actor.id]:[movie.id = movie_id]
                },
            })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },



 /*    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, */
    
    
    
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))
    },
    create: function (req,res) {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
    },
    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) 
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
    },

    login: function (req,res) {
        res.render('login', {title: 'Fun Movies Now - Acceso'})

        res.render(path.join(__dirname, '../views/login.ejs'));
        check('name').inLenght({min: 1}).withMessage('Debe ingresar un nombre de usuario valido');
        
    },



    register: function (req,res) {
        res.render('register', {title: 'Fun Movies Now - Registro'});
        //res.sendFile(path.join(__dirname, '../views/register.ejs'));
    },


	newRecord:  (req, res) => {
        const {body} = req;
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('/register', {errors: errors.array() });
        }else {
            req.session.firstName = req.body.firstName;
            req.session.lastName = req.body.lastName;
            req.session.email = req.body.email;
            req.session.psw = req.body.psw;
            req.session.psw_repeat = req.body.psw_repeat;
            req.session.category = req.body.category;
            if (req.body.remember){
                res.cookie('record', req.body, {maxAge: 60 * 1000})
            }
            let newUser = {
		 	    id: users[users.length - 1].id + 1,
		 	    ...req.body,
            }
        }
		users.push(newUser);
		fs.writeFileSync(usersFilePath, JSON.stringify(users, null, ' '));
		return res.redirect('/login/');
/* 
            let user = req.body;
            userId = userModel.create(user);
            res.redirect('/');np
 */       
	},




}

module.exports = moviesController;