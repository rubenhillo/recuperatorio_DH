const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const indexRoute = require('./routes/index');
const movieRoute = require('./routes/movieRouter');
const app = express();

const session = require('express-session');
const cookies = require('cookie-parser');

app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
	secret: "Magic word",
	resave: false,
	saveUninitialized: false,
}));
app.use(cookies());

app.use(indexRoute);
app.use(movieRoute);

app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));