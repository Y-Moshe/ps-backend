const multer = require('multer'),
      multerS3 = require('multer-s3'),
      aws = require('aws-sdk');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET
} = require('../config');
const { CustomError } = require('../utils')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const getTypes = () => Object.keys(MIME_TYPE_MAP).map(key => MIME_TYPE_MAP[key]).join(', ');

const s3 = new aws.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: 'eu-central-1'
});

const upload = multer({
  limits: { fieldSize: 512000 },
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: S3_BUCKET,
    // Check for file type, jpg, jpeg, png are acceptable.
    // Any others reject!
    metadata: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new CustomError(`Invalid image type or file, only ${getTypes()} are allowed!`, 406);

      if (isValid) {
        error = null;
      }

      cb(error, { fieldName: file.fieldname });
    },
    // Save the file name in the following format.
    key: (req, file, cb) => {
      const name = file.originalname.split(' ').join('-');
      const extenstion = MIME_TYPE_MAP[file.mimetype];

      cb(null, name.concat('-', Date.now(), '.', extenstion));
    }
  })
});

module.exports = upload;
