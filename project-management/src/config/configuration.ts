export default () => ({
    port: 3030,
    database: process.env.DATABASE_URL,

    secretKey: process.env.SECRET_KEY,
    atSecretKey: process.env.AT_SECRET_KEY,
    rtSecretKey: process.env.RT_SECRET_KEY,
    emailSecretKey: process.env.EMAIL_SECRET_KEY,
    
    emailAddress: process.env.EMAIL_ADDRESS,
    emailPassword: process.env.EMAIL_PASSWORD
});
