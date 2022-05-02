const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const {validationResult, check} = require('express-validator');
const req = require('express/lib/request');
const res = require('express/lib/response');
const bcryptjs = require('bcryptjs');
//const { Where } = require('sequelize/types/utils');

const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const Users = db.User;

const mainController = {
   
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('movieList.ejs',  {movies} )
            })
    },

    'login': function (req,res) {
        /* if (req.session.name){
            let data =req.session
            return res.render('login', {title: 'Fun Movies Now - Acceso', data})
        } */
        res.render('login', {title: 'Acceso'});
    },  

    'session': function (req,res) {
        const {body} = req;
        Users
        let userToLogin = {
            usuario: req.body.usuario,
            psw: bcryptjs.hashSync(req.body.psw, 10)
        };
        console.log(userToLogin);

        let userInDB = (function(req, res) {
                db.User.findAll({
                where: {
                    name: req.body.usuario,
                    password: {[Op.like]: '%bcryptjs.compareSync(req.body.psw, password)%'}
                }
                .then(function(users) {
                    res.render('/', {users})})

                .catch(error => res.send(error))})
                
                });
        console.log(userInDB);
      //  let passOk = bcryptjs.compareSync(req.body.psw, password);
        
    
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {errors: errors.array() });
        }else {
            if (req.body.remember){
                res.cookie('sesion', req.body, {maxAge: 60 * 1000})
            }
                 res.redirect('/')
                 console.log(req.session)
        }
    },


    'register': function (req,res) {
        res.render('register', {title: 'Registro'});
    },


	'newRecord':  (req, res) => {

        console.log(req.body);
         
        const {body} = req;
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('register', {errors: errors.array(),oldData: req.body });
        }else{
        
            let mailInDB = req.body.mail;
            console.log(mailInDB);
        }

    /*        
            Users
            .findOne(mailInDB) 
            .then((mailInDB)=> {
                if (mailInDB) {
                return res.render('register', {
                    errors: {
                        email: {
                            msg: 'Este email ya está registrado'
                        }
                    },
                    oldData: req.body
                });
                }
            }
        
            )

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
  --------------------------------       */
        
         
       /*  let userToCreate = {
			...req.body,
			password: bcryptjs.hashSync(req.body.password, 10),
		}
        let userCreated = User.create(userToCreate);
 */
		
        
        




/*

            req.session.name = req.body.name;
            req.session.psw = req.body.password;
            req.session.psw_repeat = req.body.psw_repeat;
            req.session.email = req.body.email;
            req.session.rememberToken = req.body.remember_token;
            req.session.rol = req.body.rol;
            if (req.body.remember){
                res.cookie('record', req.body, {maxAge: 60 * 1000})
            }
            let newUser = {
		 	    id: users[users.length - 1].id + 1,
		 	    ...req.body,
            }
        }
		
*/
      
       
 	 },

    }
    
module.exports = mainController;