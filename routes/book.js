const path = require('path');

const express = require('express');

const bookController = require('../controllers/book');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/home', bookController.getIndex);

router.get('/book-details/:bookId', bookController.getBookDeatils);

router.get('/book/:bookId',bookController.getBook);

router.get('/facts',bookController.getFacts);


module.exports = router;
