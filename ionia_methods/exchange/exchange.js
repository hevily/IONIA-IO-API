const http = require('../../ionia_modules/http')
const host = 'https://shapeshift.io'

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

    return result;
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
