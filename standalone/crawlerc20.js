const fs = require('fs')
const http = require('../common/modules/http')
const cheerio = require('cheerio')
const entities = require("entities")
const host = 'https://etherscan.io'
const ercContractAddressesPath = '/home/arnoldyoo/Documents/ionia/IONIA-IO-API/common/smart_contracts/erc20_address.json'
const contractAbiPath = '/home/arnoldyoo/Documents/ionia/IONIA-IO-API/common/smart_contracts/erc20'

async function crawl(limit) {
    const page = limit / 50
    const tokenListUri = '/tokens'
    const contractAddresses = JSON.parse(fs.readFileSync(ercContractAddressesPath, 'utf8'))

    for(let i = 1 ; i <= page ; i++) {       
        const response = await http.request(host + tokenListUri + `?p=${i}`, 'GET')
        const $ = cheerio.load(response)
        const tokens = $('div[id="ContentPlaceHolder1_divresult"]').find('table > tbody > tr')

        for(let j = 0 ; j < tokens.length ; j++) {
            const tokenObject = tokens.eq(j)
            
            const aTag = tokenObject.find('td[class="visible-xs"] > a').eq(0)

            const contractCode = aTag.attr('href').split('/')[2]
            const tokenTemp = aTag.html().split(' (')[1]
            const tokenName = tokenTemp.split(')')[0].toLowerCase();
            console.log(tokenName);

            const contractAbiCode = await getContractAbiCode(contractCode)
            
            if(['', undefined, null].indexOf(contractAbiCode) === -1) {
                fs.writeFileSync(`${contractAbiPath}/${tokenName}-contract-abi.json`, entities.decodeHTML(contractAbiCode))
                contractAddresses[tokenName] = contractCode
            }
        }
    }
    fs.writeFileSync(ercContractAddressesPath, JSON.stringify(contractAddresses))
}


async function getContractAbiCode(contractCode) {
    const uri = `/address/${contractCode}`

    const response = await http.request(host + uri, 'GET')
    const $ = cheerio.load(response)

    return $('pre[id="js-copytextarea2"]').html()
}

const limit = 50
crawl(limit)