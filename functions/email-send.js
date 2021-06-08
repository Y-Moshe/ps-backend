const sendGridMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY, SENDGRID_VERIFIED_SENDER } = require('../config');
sendGridMail.setApiKey( SENDGRID_API_KEY );

/**
 * SendGrid dynamic templates ids.
 */
const Templates = {
    CONTACT:        'd-92d2f11b2e6e4faf8a5150f93ea1d806',
    VERIFY_EMAIL:   'd-07a8ac1aeda14695be38aa8c58d21d2a',
    PASSWORD_RESET: 'd-4883aaa9bea841a09c12ca76382191a3',
    ORDER:          'd-71b100f6eca14f13a6ea0ff05ba8161c'
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
