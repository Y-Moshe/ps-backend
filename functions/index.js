const upload = require('./image-upload'),
      { emailSend, Templates } = require('./email-send');

module.exports = {
    upload,
    Templates,
    emailSend
};
