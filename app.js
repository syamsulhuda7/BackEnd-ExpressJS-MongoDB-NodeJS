const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors');
const {decodeToken} = require('./middlewares');
const productRoute = require('./app/product/router');
const categoryRoute = require('./app/category/router');
const tagRoute = require('./app/tag/router');
const authRoute = require('./app/auth/router');
const deliveryAddressRoute = require('./app/deliveryAddress/router');
const cartRoute = require('./app/cart/router');
const orderRoute = require('./app/order/router');
const invoiceRoute = require('./app/invoice/router');
// const passport = require('./utils/passport');
// const session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors(
  {
  origin: ['http://localhost:5173', 'https://localhost:3001'], // Atur asal yang diizinkan
  credentials: true // Izinkan pengiriman cookie dengan permintaan lintas domain
}
));
// app.use(session({
//   secret: process.env.SECRET_KEY, // Mengakses SECRET_KEY dari variabel lingkungan
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(decodeToken());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoute);
app.use('/api', productRoute);
app.use('/api', categoryRoute);
app.use('/api', tagRoute);
app.use('/api', deliveryAddressRoute);
app.use('/api', cartRoute);
app.use('/api', orderRoute);
app.use('/api', invoiceRoute);
//home
app.use('/', function(req,res) {
  res.render('index', {
    title: 'Eduwork API Service BE2'
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
