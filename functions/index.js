const upload = require('./image-upload'),
      { getTemplate, emailSend } = require('./email/email-send');

module.exports = {
    upload,
    getTemplate,
    emailSend
};
