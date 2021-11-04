module.exports = {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    PORT: process.env.PORT || 7001,
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWORD_HASH_SALT: 10,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    AWS_URL: process.env.AWS_URL,

    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_VERIFIED_SENDER: process.env.SENDGRID_VERIFIED_SENDER,

    CLIENT_URI: process.env.CLIENT_URI || "http://localhost:3000"
}
