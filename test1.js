var convertRupeesIntoWords = require('convert-rupees-into-words');
const fs = require('fs');

fs.readFile('res1.json', (err, data) => {
    if (err) throw err;

    // res1
    // let str = JSON.parse(data).text;

    // rest
    let str = JSON.parse(data).text;
    console.log(str)
    const amountRgx = /total[^\d]*[\d,.]*/gi; 
    let amount = str.match(amountRgx);
    if (amount != null) {
        amount = amount[amount.length - 1];
        amount = amount.substring(amount.match(/[\d]/).index, amount.length);
        // amount = amount.substring(7, amount.length - 6);
    }
    console.log(amount);
    const verifyAmtRgx = /\(rupees[\s\S]*only\)/gi;
    let verifyAmt = str.match(verifyAmtRgx);
    verifyAmt = verifyAmt[0];
    verifyAmt = verifyAmt.substring(8, verifyAmt.length - 6);
    let verifyAmt_float = "";
    for (let i = 0 ; i < amount.length ; i++) {
        if (amount[i] != ',') {
            verifyAmt_float += amount[i];
        }
    }
    verifyAmt_float = parseFloat(verifyAmt_float)
    let check = convertRupeesIntoWords(verifyAmt_float);
    check = check.substring(0, check.length - 7);
    console.log(verifyAmt.toLowerCase(), '--', check.toLowerCase());
})