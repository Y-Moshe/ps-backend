const fs = require('fs'),
      handlebars = require('handlebars'),
      sendGridMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = require('../../config');
sendGridMail.setApiKey( SENDGRID_API_KEY );

// Preparing the email templates
const templates = {
    contact: handlebars.compile(
        fs.readFileSync( __dirname + '/templates/contact.html').toString() ),
    emailVerify: handlebars.compile(
        fs.readFileSync( __dirname + '/templates/email-verify.html').toString() ),
    resetPassword: handlebars.compile(
        fs.readFileSync( __dirname + '/templates/password-reset.html').toString() )
};

/**
 * Gets the right email message template based on 'template' argument.
 * @param {string} template The template: 'contact'| 'emailVerify' | 'resetPassword'.
 * @param {object} templateData The template data, like { fullName, links, message }, any.
 */
function getTemplate( template, templateData ) {
    let temp = '';

    switch (template) {
        case 'resetPassword':
            temp = templates.resetPassword({ ...templateData });
            break;
        case 'emailVerify':
            temp = templates.emailVerify({ ...templateData });
            break;
          // contact case
        default:
            temp = templates.contact({ ...templateData });
  }

  return temp;
}

/**
 * Send an email message using sendGrid mail service.
 * @param {string} from email from
 * @param {string} to email address to send to
 * @param {string} subject The subject
 * @param {string} content The content, use `getTemplate`.
 * @returns Promise.
 */
const emailSend = ( from, to, subject, content ) => {
    return sendGridMail.send({
        from,
        to,
        subject,
        html: content
    });
};

module.exports = {
  getTemplate,
  emailSend
};
