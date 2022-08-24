export default () => ({
    port: 3030,
    database: process.env.DATABASE_URL,
    secretKey: process.env.SECRET_KEY
});