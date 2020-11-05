const Book = require('../models/books');
const fs = require('fs');
const path = require('path');

exports.getBookDeatils = (req, res, next) => {
  const bId = req.params.bookId;
  Book.findById(bId)
    .then(book => {
      res.render('bookViews/book-detail', {
        book: book,
        pageTitle: book.title,
        path: '/book Details'
      });
    })
    .catch(err => console.log(err));
};

exports.getFacts = (req,res,next) =>{
  res.render('bookViews/facts',{
        pageTitle: 'Facts',
        path: '/book Details'
  });
}

exports.getIndex = (req, res, next) => {
  Book.find()
    .then(books => {
      res.render('bookViews/index', {
        books: books,
        pageTitle: 'Book Library',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getBook = (req, res, next) => {
  Book.findById(req.params.bookId).then(result => {
    console.log(result);
    res.sendFile(path.join(__dirname, "..", result.bookUrl));
  })
}


