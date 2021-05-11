/**
 * A global error handler to catch all types of errors.
 * And trying to find out which error message to send back to the Response!
 */
const middleware = (error, req, res, next) => {
  if (error) {
      let message = '';
      let status = error?.status || 500;

      switch (error.name) {
          // If the error thrown was our CustomError
          // We know that there's a described error message to send back
          case 'CustomError':
              message = error.message;
              break;
          case 'TokenExpiredError':
              message = 'Invalid token or old one.';
              status = 401;
              break;
          case 'ValidationError':
              /**
               * ValidationError in mongoose can occurs by a few "Invalid statement"
               * So what we do here is getting the first 'path', for example 'username' in the schema
               * Then accessing its error message.
               */
              const path = Object.keys(error.errors)[0];
              message = error.errors[path].message;
              status = 400;
              break;
          case 'CastError':
              message = 'An invalid Paramater';
              status = 400;
              break;
          default:
              message = 'An unknown error has occurred';
      }

      console.log(error);
      res.status(status).json({ message });
  } else {
      next();
  }
};

module.exports = middleware;
