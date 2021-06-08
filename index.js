const express = require('express'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      passport = require('passport');
require('dotenv').config();

const {
  AuthRoutes,
  CategoriesRoutes,
  CommentsRoutes,
  OrdersRoutes,
  ProductsRoutes,
  UsersRoutes
} = require('./routes');
const contactController = require('./controllers/contact');
const { errorHandler } = require('./middlewares');

const { DB_CONNECTION_STRING, PORT } = require('./config');
const { getVersion } = require('./utils');

const BASE_URI = `/api/v${ getVersion() }`;
const app = express();
app.request.baseURI = BASE_URI;

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

  // Initiate Ranks and Roles
  require( './functions/initiate-roles' );
}).catch(error => {
  console.log('Failed to Connect to Database!');
  console.error('Error: ' + error);
});

app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

// Passport initialization
require( './passport' );
app.use( passport.initialize() );

app.get( '/', ( req, res ) => res.status(200).send('Hello from Node.js server :)') );

app.use( '/assets', express.static( __dirname.concat( '/assets' )) );

app.use( BASE_URI.concat('/auth'), AuthRoutes );

app.use( BASE_URI.concat('/categories'), CategoriesRoutes );

app.use( BASE_URI.concat('/comments'), CommentsRoutes );

app.use( BASE_URI.concat('/orders'), OrdersRoutes );

app.use( BASE_URI.concat('/products'), ProductsRoutes );

app.use( BASE_URI.concat('/users'), UsersRoutes );

// POST: /api/v@/contact
app.post( BASE_URI.concat('/contact'), contactController );

/**
 * Using a global error handler to catch all types of errors.
 * And trying to find out which error message to send back to the Response!
 */
app.use( errorHandler );

app.get( '/*', ( req, res ) => res.redirect('/') );

app.listen( PORT, () => console.log(`Server(v${ getVersion() }) is running on port: ${ PORT }`) );
