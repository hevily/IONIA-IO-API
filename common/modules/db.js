const knex = require('knex')
const PRIVACY = require('../../privacy.json')


const db = knex({
    client: 'mysql',
    connection: {
        host : PRIVACY.MYSQL.HOST,
        user : PRIVACY.MYSQL.USER,
        password : PRIVACY.MYSQL.PASSWORD,
        database : PRIVACY.MYSQL.DATABASE
    }
})


module.exports = db;