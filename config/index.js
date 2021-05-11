module.exports = {
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    PORT: process.env.PORT || 7001,
    JWT_SECRET: process.env.JWT_SECRET,
    INITIAL_USER_RANK_ID: "5fd11a2a5876d8ba4b2202e6",
    PASSWORD_HASH_SALT: 10,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    AWS_URL: process.env.AWS_URL,

    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME,

    CLIENT_URI: "http://localhost:3000",
    GMAIL_USER: "",
    MY_GMAIL_ADDRESS: ""
}
