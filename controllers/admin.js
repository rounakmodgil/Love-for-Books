const Book = require('../models/books');

exports.getAddBook = (req, res, next) => {
  res.render('admin/edit-book', {
    pageTitle: 'Add Book',
    path: '/admin/add-book',
    editing: false
  });
};

exports.postAddBook = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const gener = req.body.gener;
  const description = req.body.description;
  const pdfFile = req.file;
  const author = req.body.author;

  // console.log("from conto",pdfFile);
  const book = new Book({
    title: title,
    gener: gener,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
    bookUrl : pdfFile.path,
    author: author
  });
  book
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/home');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditBook = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.bookId;
  Book.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-book', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-book',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditBook = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedgener = req.body.gener;
  const updatedAuthor = req.body.author; 
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;


  Book.findById(prodId)
    .then(book => {
      book.title = updatedTitle;
      book.gener = updatedgener;
      book.description = updatedDesc;
      book.imageUrl = updatedImageUrl;
      book.author = updatedAuthor;
      return book.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/home');
    })
    .catch(err => console.log(err));
};

exports.getBooks = (req, res, next) => {
  Book.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/books', {
        prods: products,
        pageTitle: 'Admin Books',
        path: '/admin/books'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteBook = (req, res, next) => {
  const prodId = req.body.productId;
  Book.findByIdAndRemove(prodId)
    .then(() => {
      console.log('Book DESTROYED');
      res.redirect('/admin/books');
    })
    .catch(err => console.log(err));
};
