const { emailSend, Templates } = require('../functions'),
      { isValidEmail }         = require('../models/validators'),
      { CustomError }          = require('../utils');
const { SENDGRID_VERIFIED_SENDER, CLIENT_URI } = require('../config');

const contact = async ( req, res, next ) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        const templateData = {
            fullName: (firstName + ' ' + lastName).trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            websiteLink: CLIENT_URI
        };

        if (!isValidEmail( email )) {
            throw new CustomError('Invalid email address', 400);
        }
  
        await emailSend(
            SENDGRID_VERIFIED_SENDER,
            Templates.CONTACT,
            templateData
        );
        
        res.status(200).json({
            message: 'Your message has been sent successfully, thank you for contact!'
        });
    } catch (error) {
      next( error );
    }
};

module.exports = contact;
