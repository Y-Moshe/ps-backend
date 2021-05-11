/**
 * Simple CustomError to be used in error-hanlder middlewere, and in general, for all app.
 */
class CustomError extends Error {
    constructor( message = '', status = 500)  {
        super( message );
        
        this.status = status;
        this.name = 'CustomError';
    }
}

module.exports = CustomError;
