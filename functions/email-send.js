const sendGridMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, SENDGRID_VERIFIED_SENDER } = require('../config');
sendGridMail.setApiKey( SENDGRID_API_KEY );

/**
 * SendGrid dynamic templates ids.
 */
const Templates = {
    CONTACT:        'd-92d2f11b2e6e4faf8a5150f93ea1d806',
    VERIFY_EMAIL:   'd-eb2fd87b7a164b6db4082fb8c8ed1f2e',
    PASSWORD_RESET: 'd-73871e30d17a4cf5be809a34403b1d55'
};

/**
 * Send an email message using sendGrid mail service.
 * @param {string} to email address to send to
 * @param {string} templateId email template id, use Templates constant.
 * @param {object} templateData the template data that it uses.
 * @returns Promise.
 */
const emailSend = ( to, templateId, templateData ) => {
    return sendGridMail.send({
        templateId,
        dynamicTemplateData: { ...templateData },
        from: SENDGRID_VERIFIED_SENDER,
        to
    });
};

module.exports = {
  Templates,
  emailSend
};
