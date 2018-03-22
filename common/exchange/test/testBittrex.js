// const bittrex = require('../bittrex');
const request = require('request');
const request_promise = require('request-promise');
const sha512 = require('sha512');
const API_KEY = '4f4f65118cb14a7e9efa8cc421ca5196';
const SECRET_KEY = 'b8c3460146fe415787460cd6174c7288';

function test() {

    let nonce = new Date().getTime();

    const uri = 'https://bittrex.com/api/v1.1/account/getbalances?apikey=' + API_KEY + '&nonce=' + nonce;

    const hasher = sha512.hmac(SECRET_KEY);
    const apisign = hasher.finalize(uri).toString('hex');

    const options = {
        'uri': uri,
        'method': 'GET',
        'qs': {
            apikey: API_KEY,
            nonce: nonce
        },
        'headers': {
            'apisign': apisign
        }
    };

    const promise = new Promise (function (resolve, reject) {
        //연산
        // 성공했을 시 
        resolve('Success');
    
        //실패시
        reject('Failed'); 
    });
    
    let response;
    // request.post(options, (error, response, responseBody) => {
    //     response = responseBody;
    //     console.log(response);
    // });

    request_promise(options).then(function(res){
        response = res
        console.log(response);
    })
    .catch(function(error){
        console.log(error);
    }).promise;

    console.log('outer response:' + response);

    // promise.then(function(value) {
    //     request.post(options, (error, response, responseBody) => {
    //         response = responseBody;
    //     }); 
    // }).then(console.log(response));
    // request.post(options, (error, response, responseBody) => {
    //     this.response = responseBody;
    //     console.log(this.response);
    // });
    // console.log('response:' + Object.keys(response));
    // console.log('response:' + response.res);
    // console.log('===========================');
}

test();