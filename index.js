const mongoose = require('mongoose');
const logger = require('morgan');

const express = require('express');
const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// const exphbs = require('express-handlebars');
// app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
// app.set('view engine', 'hbs');

var exphbs = require('express-handlebars');
app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main'
	})
);
app.set('view engine', 'handlebars');

app.use(express.static('public/'));

var URI = process.env.MONGODB_URI || 'mongodb://localhost/georgetown-scraper';
mongoose.connect(URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Connected to Mongoose!');
});

const router = require('./controller/controller.js');
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Listening on http://localhost:3000');
});
