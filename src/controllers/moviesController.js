const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const {validationResult, check} = require('express-validator');
const req = require('express/lib/request');
//const { Where } = require('sequelize/types/utils');

const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const Users = db.User;


const moviesController = {
   
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('movieList.ejs',  {movies} )
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include: ['genre','actors','actor_movie'],
               /*  include: ['actors'],
                include: ['actor_movie'], */
                where: {
                    actor_id : {[Op.like] : req.body.actor.id},
                    movie_id : {[Op.like] : req.body.movie.id}
                },
            })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    
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
    'create': function (req,res) {
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
    'edit': function(req,res) {
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
    'update': function (req,res) {
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
    'delete': function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
    },
    'destroy': function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) 
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
    },

    'login': function (req,res) {
        /* if (req.session.name){
            let data =req.session
            return res.render('login', {title: 'Acceso', data})
        } */
        res.render('login', {title: 'Fun Movies Now - Acceso'});
    },  

    'session': function (req,res) {
        const {body} = req;
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {errors: errors.array() });
        }else {
            if (req.body.remember){
                res.cookie('sesion', req.body, {maxAge: 60 * 1000})
            }
            res.render('/');
        }
    },

/* 
    'register': function (req,res) {
        res.render('register', {title: 'Fun Movies Now - Registro'});
    },


	'newRecord':  (req, res) => {
        const {body} = req;
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('register', {errors: errors.array() });
        }else {
                Users
                .create(
                    {
                        name: req.body.name,
                        password: req.body.password,
                        email: req.body.email,
                        remember_token: req.body.remember_token,
                        rol: req.body.rol,
                    }
                )
                .then(()=> {
                    let user = req.body;
                    userId = Users.create(user);
                    //res.redirect('/login', next);//np
                    return res.redirect('/login')})            
                .catch(error => res.send(error))
                }
       
	},
 */
}

module.exports = moviesController;