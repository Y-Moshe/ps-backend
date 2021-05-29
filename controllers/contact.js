const { getTemplate, emailSend } = require('../functions'),
      { MY_GMAIL_ADDRESS } = require('../config');

const contact = async ( req, res, next ) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        const data = {
            fullName: (firstName + ' ' + lastName).trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        };
  
        await emailSend(
            email,
            MY_GMAIL_ADDRESS,
            'no-replay',
            getTemplate('contact', data)
        );

        res.status(200).json({
            message: 'Your message has been sent successfully, thank you for contact!'
        });
    } catch (error) {
      next( error );
    }
};

module.exports = contact;
