const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/book');
const authRoutes = require('./routes/auth');


const MONGODB_URI =
  'mongodb+srv://bhavesh_05:Bhavesh2017@cluster0-yuok1.mongodb.net/booklove?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb)=>{
      cb(null, 'books');
  },
  filename: (req, file, cb)=>{
      cb(null, Math.random().toString() +'_'+file.originalname);
  }
});
//chekc

const filefilter = (req,file,cb)=>{
  if(file.mimetype === 'application/pdf'){
      cb(null, true);
  }
  else{
      cb(null, false);
  }
  
}

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage, fileFilter:filefilter}).single('bookUrl'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'books')));
app.use('/books',express.static(path.join(__dirname, 'books')));
app.use(
  session({
    secret: 'super super secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());



app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(bookRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
