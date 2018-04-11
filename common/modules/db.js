const mysql = require('promise-mysql')
const PRIVACY = require('../../privacy.json')


const db = require('knex')({
    client: 'mysql',
    connection: {
        host : PRIVACY.MYSQL.HOST,
        user : PRIVACY.MYSQL.USER,
        password : PRIVACY.MYSQL.PASSWORD,
        database : PRIVACY.MYSQL.DATABASE
    }
})


module.exports = db;