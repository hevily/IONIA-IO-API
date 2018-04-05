const mysql = require('promise-mysql')
const PRIVACY = require('./privacy.json')


const config = {
    host: PRIVACY.MYSQL.HOST,
    port: PRIVACY.MYSQL.PORT,
    user: PRIVACY.MYSQL.USER,
    password: PRIVACY.MYSQL.PASSWORD,
    database: PRIVACY.MYSQL.DATABASE,
    connectionLimit: 100,
};

const pool = mysql.createPool(config)

module.exports = pool;