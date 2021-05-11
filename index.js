const express = require('express'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      passport = require('passport');
require('dotenv').config();

const { CONTACT_TEMPLATE, emailVerification } = require('./middlewares/email-verification');

const {
  CommentsRoutes,
  CategoriesRoutes,
  OrdersRoutes,
  ProductsRoutes,
  UsersRoutes
} = require('./routes');
const { errorHandler } = require('./middlewares');

const { DB_CONNECTION_STRING, PORT } = require('./config');
const { getVersion } = require('./utils');

const BASE_URI = `/api/v${ getVersion() }`;
const app = express();

/**
 * A middleware to delay the response from the server.
 * Use that for Development purposes only!
 */
// app.use((req, res, next) => setTimeout( next, 1000 ));

mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to Database!');
}).catch(error => {
  console.log('Failed to Connect to Database!');
  console.error('Error: ' + error);
});

app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.use(passport.initialize());

app.get('/', ( req, res ) => res.status(200).send('Hello from Node.js server :)'));

app.use('/assets', express.static( __dirname.concat( '/assets' )));

app.use( BASE_URI.concat('/users'), UsersRoutes );

app.use( BASE_URI.concat('/products'), ProductsRoutes );

app.use( BASE_URI.concat('/comments'), CommentsRoutes );

app.use( BASE_URI.concat('/categories'), CategoriesRoutes );

app.use( BASE_URI.concat('/orders'), OrdersRoutes );

// POST: /api/v@/contact
app.post( BASE_URI.concat('/contact'), emailVerification( CONTACT_TEMPLATE ));

/**
 * Using a global error handler to catch all types of errors.
 * And trying to find out which error message to send back to the Response!
 */
app.use(errorHandler);

app.get('/*', ( req, res ) => res.redirect('/'));

app.listen(PORT, () => console.log(`Server(v${ getVersion() }) is running on port: ${ PORT }`))
