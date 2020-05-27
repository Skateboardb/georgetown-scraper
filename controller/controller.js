const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');

const cheerio = require('cheerio');

const Comment = require('../models/comment.js');
const Article = require('../models/article.js');
const Title = require('../models/Title')

// ============================= HOME PAGE =============================

router.get('/', (req, res) => {
	Article.find({}).then(function(data) {
		res.render('index');
	});
});

router.get('/scrape', (req, res) => {
	// First, we grab the body of the html with request
	console.log(req.query);

	let link = req.query.link
	let category = req.query.category

	axios.get(link).then(function(response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);
		console.log($);
		

		// Now, we grab every h2 within an article tag, and do the following:
		$('div.views-field-phpcode').each(function(i, element) {
			// Save an empty result object
			const result = {};

			// Add the text and href of every link, and save them as properties of the result object

			result.title = $(element)
				.children('span.field-content')
				.children('a')
				.text()

			// result.subtitle = $(element)
			// 	.siblings('div.views-field-phpcode-1')
			// 	.children('span')
			// 	.text()

			// result.author = $(element)
			// .siblings('div.views-field-field-by-line-1-value')
			// .children('span')
			// .text()

			result.edition = $(element)
			.siblings('div.views-field-field-edition-value')
			.children('span')
			.text()

			result.link = $(element)
			.children('span.field-content')
			.children('a')
			.attr('href')

			result.category = category

			


			// result.title = $(element)
			// 	.children('span.newsblock-story-card__info')
			// 	.children('h2')
			// 	.children('a')
			// 	.text()
			// 	.split(`\n`)[0];

			// result.link = $(element)
			// 	.children('span.newsblock-story-card__info')
			// 	.children('h2')
			// 	.children('a')
			// 	.attr('href');

			// result.summary = $(element)
			// 	.children('span.newsblock-story-card__info')
			// 	.children('p')
			// 	.text();

			// result.img = $(element)
			// 	.children('span.newsblock-story-card__image-link')
			// 	.children('span')
			// 	.children('img')
			// 	.attr('src');

			// console.log(result);
			// Create a new Title using the `result` object built from scraping
			Title.create(result)
				.then(function(dbTitle) {
					// View the added result in the console
					console.log(dbTitle);
				})
				.catch(function(err) {
					// If an error occurred, send it to the client
					return res.json(err);
				});
		});

		// If we were able to successfully scrape and save an Article, send a message to the client
		res.redirect('/');
	});
});

router.get('/titles', function(req, res) {
	Title.find({category: req.query.category}).exec(function(err, doc) {
		console.log(this.category);
		
		if (err) {
			console.log(error);
		} else {
			res.json(doc);
			console.log(doc);
			
		}
	});
});

// ============================= SAVED ARTICLES =============================

router.get('/titles/:category', (req, res) => {
	Title.find({ category: req.query.category })
		
		.exec(function(error, doc) {
			if (error) {
				console.log(error);
			} else {
				res.json(doc);
			}
		});
});



router.get('/saved', (req, res) => {
	res.render('saved');
});
module.exports = router;

router.post('/save/:id', (req, res) => {
	Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).exec(
		(err, doc) => {
			if (err) {
				console.log(err);
			} else {
				console.log('doc: ', doc);
			}
		}
	);
});

router.post('/unsave/:id', (req, res) => {
	Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }).exec(
		(err, doc) => {
			if (err) {
				console.log(err);
			} else {
				console.log('doc removed: ', doc);
			}
		}
	);
	res.redirect('/saved');
});

router.get('/articles/:id', (req, res) => {
	Article.findOne({ _id: req.params.id })
		.populate('comments')

		.exec(function(error, doc) {
			if (error) {
				console.log(error);
			} else {
				res.json(doc);
			}
		});
});

router.post('/comment/:id', (req, res) => {
	var newComment = new Comment(req.body);

	newComment.save((error, newComment) => {
		if (error) {
			console.log(error);
		} else {
			Article.findOneAndUpdate(
				{ _id: req.params.id },
				{ $push: { comments: newComment._id } },
				{ new: true }
			).exec((err, doc) => {
				if (err) {
					console.log(err);
				} else {
					console.log('doc', doc);
					res.send(doc);
				}
			});
		}
	});
});
