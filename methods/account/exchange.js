const http = require('../../common/modules/http')
const host = 'https://shapeshift.io'
const db = require('../../common/modules/db');

async function getexchangeablecoins(params) {
    const uri = '/getcoins';

    const response = await http.request(host + uri, 'GET');

    const result = [];

    for(const coinName in response) {
        const coin = response[coinName];

        if(coin.status === 'available') {
            result.push(coin.symbol.toLowerCase());
        }
    }

    return result
}

exports.getexchangeablecoins = getexchangeablecoins

async function marketinfo(params) {
    const uri = `/marketinfo/${params.pair}`
    const response = await http.request(host + uri, 'GET')
    return response;
}

exports.marketinfo = marketinfo

async function shapeshift(params) {
    const uri = `/sendamount`
    const requestObject = {
        pair: params.pair,
        amount: params.amount,
        withdrawal: params.receiveAddress, // receiver address
        returnAddress: params.sendAddress // sender address
    }
    console.log(requestObject);

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response = await http.request(host + uri, 'POST', headers, requestObject)
    return response
}

exports.shapeshift = shapeshift

async function cancelexchange(params) {
    const uri = `/cancelpending`
    const requestObject = {
        address: params.address
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    const response = await http.request(host + uri, 'POST', headers, requestObject)
    return response
}

exports.cancelexchange = cancelexchange

async function transactionstat(params) {
    const uri = `/txStat/${params.address}`
    const response = await http.request(host +uri, 'GET')
    return response
}

exports.transactionstat = transactionstat

async function gethistory(params) {
    const result = await db.query(`SELECT * FROM exchange_history WHERE account='${params.account}'`)
    return result
}

async function insertHistory() {
    const insertquery = `INSERT INTO exchange_history (account, amount, fromto, receiveaddress, sendaddress, timestamp) VALUES (?, ?, ?, ?, ?, ?)`
    const temp = {
        orderId: '0ed0d2d8-01da-4a75-bc54-33d7d5972d64',
        pair: 'btc_eth',
        withdrawal: '0x8849ffa08d4d7efc164c498d2bf53c4dbd91c2de',
        withdrawalAmount: '0.01',
        deposit: '3KvtntEgbqp9nDmp9yRBbQ9EcMZ9cpS4Kq',
        depositAmount: '0.00061855',
        expiration: 1522806722940,
        quotedRate: '17.94519309',
        maxLimit: 0.68154061,
        returnAddress: '37g2b3jiDFAVwpVNCWAUjrQJAcFRrwQyNg',
        apiPubKey: 'shapeshift',
        minerFee: '0.0011'
    }
    const time = new Date().getTime()
    const insert_result = await db.query(insertquery, ['arnold', temp.withdrawalAmount, temp.pair, temp.withdrawal, temp.returnAddress, time.toString()])
}

exports.gethistory = gethistory
