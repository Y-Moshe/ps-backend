const jwt = require('jsonwebtoken');

const {
  SENDGRID_API_KEY,
  JWT_SECRET,
  CLIENT_URI,
  GMAIL_USER,
  MY_GMAIL_ADDRESS
} = require('../config');

const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey( SENDGRID_API_KEY );

const FORGOT_PASSWORD_TEMPLATE = 1,
      VERIFICATION_TEMPLATE = 2,
      CONTACT_TEMPLATE = 3;

/**
 * Get right email message template based on 'template' argument.
 * @param {number} template The template constant.
 */
function getTemplate(template, fullName, internalLink, message, email) {
  let temp = '';

  switch (template) {
    case FORGOT_PASSWORD_TEMPLATE:
      temp = `
        <div dir="ltr" style="padding: 50px; background-color: #f8f9fa; font-size: 17px; color: #6c757d;">
          <h1>Hi ${fullName}</h1>
          <p style="color: #6c757d;">You have been requested to reset the password in our website, to <b>RESET YOUR PASSWORD</b> Please
          click on the link below!</p>
          <p style="color: #ffc107">You have 2 hours to complete this process!</p>
          <a href="${internalLink}">RESET PASSWORD</a><br><br><br>

          <p style="color: #dc3545">If you haven't asked to <b>RESET PASSWORD</b> Please, ignore.</p>
        </div>`
      break;
    case VERIFICATION_TEMPLATE:
      temp =  `
        <div dir="ltr" style="padding: 50px; background-color: #f8f9fa; font-size: 17px; color: #6c757d;">
          <h1>Dear ${fullName}</h1>
          <p style="color: #6c757d;">You have been requested to Sign-Up to our website, Please, verify your email
          address!</p>
          <p style="color: #ffc107">You have 2 hours to complete this process!</p>
          <a href="${internalLink}">VERIFY NOW</a><br><br><br>

          <p style="color: #dc3545">If you haven't asked to <b>Sign-Up</b> to our website, Please, ignore.</p>
        </div>`
      break;
    // CONTACT_TEMPLATE
    default:
      temp = `
        <div dir="ltr" style="height: 600px; background-color: #f8f9fa; padding: 50px">
          <h1>Hey, you got a new message from ${fullName}</h1>
          <p style="color: #28a745; font-size: 17px">Message: ${message}</p>
          <p style="color: #ffc107; font-size: 23px">his email: ${email}</p>
        </div>`
  }

  return temp;
}

/**
 * Get the right success message based on the 'template' argument.
 * @param {number} template The template constant.
 */
function getResponseMessage(template) {
  let message = '';

  switch (template) {
    case FORGOT_PASSWORD_TEMPLATE:
      message = 'Your request has been accepted successfully, check your mailbox, to continue!';
      break;
    case VERIFICATION_TEMPLATE:
      message = 'An E-Mail message has been sent to your email address, please check your mailbox and verify your email address.';
      break;
    // CONTACT_TEMPLATE
    default:
      message = 'Your message has been sent successfully, thank you for contact!';
  }

  return message;
}

/**
 *
 * @param {number} template The template, use the Template Constants.
 */
const middleware = (template) => async (req, res, next) => {
  try {
    // email is a unique value, and will be used for token.
    // message is for CONTACT_TEMPLATE case, can be null or undefined.
    const { email, message, firstName, lastName } = req.body;
    let fullName = req.body?.fullName;
    let token = '';
  
    // Basiclly try to get the fullName
    if (!fullName) {
      if (firstName && lastName) {
        fullName = req.body.firstName + ' ' + req.body.lastName;
      } else {
        fullName = req.user.firstName + ' ' + req.user.lastName;
      }
    }
  
    // In case of FORGOT_PASSWORD_TEMPLATE or VERIFICATION_TEMPLATE create a token
    if (!template === CONTACT_TEMPLATE) {
      token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
    }
  
    const url = CLIENT_URI.concat('/auth/',
      template === FORGOT_PASSWORD_TEMPLATE ? 'reset-password' : 'verify', '?token=', token);
  
    // If it's CONTACT_TEMPLATE, send email to MY_GMAIL_ADDRESS, otherwise send from GMAIL_USER to user email
    const from = template === CONTACT_TEMPLATE ? email : GMAIL_USER;
    const to = template === CONTACT_TEMPLATE ? MY_GMAIL_ADDRESS : email;
  
    const subject = 'no-replay';
    const content = getTemplate(template, fullName, url, message, email);

    await sendGridMail.send({
      from,
      to,
      subject,
      html: content
    });

    res.status(200).json({ message: getResponseMessage(template) });
  } catch (error) {
    next( error );
  }
};

module.exports = {
  FORGOT_PASSWORD_TEMPLATE,
  VERIFICATION_TEMPLATE,
  CONTACT_TEMPLATE,
  emailVerification: middleware
};
