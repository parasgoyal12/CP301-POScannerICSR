const fs = require('fs');

fs.readFile('res2.json', (err, data) => {
    if (err) throw err;

    // res1
    // let str = JSON.parse(data).text;

    // rest
    let str = JSON.parse(data).fullTextAnnotation.text;
//     console.log(str);

    // Assumptions for rgx in comments, won't work without these

    // xx.xx.xxxx format, First instance is always date (as in samples)
    const dateRgx = /\d{2}[.]\d{2}[.]\d{4}/;
    let date = str.match(dateRgx);
    if (date != null) {
        date = date[0];
    }

    // Total followed by Amt
    // sometimes rs symbol -> 3
    const amountRgx = /total[^\d]*[\d,.]*/gi; 
    let amount = str.match(amountRgx);
    if (amount != null) {
        amount = amount[amount.length - 1];
        amount = amount.substring(amount.match(/[\d]/).index, amount.length);
    }

    // PO number starts with digit and ??
    const PONoRgx = /po[" "]*no[^\d]*[\d-,/\w]*/i;
    let PO = str.match(PONoRgx);
    if (PO != null) {
        PO = PO[0];
        PO = PO.substring(PO.search(/[\d]/), PO.length);
    }

    // Supple of 'item'
    const itemRgx = /supply[" "]*of[^\w]*[\w" "\d-.,:]*[^'\n]/i;
    let item = str.match(itemRgx);
    if (item != null) {
        item = item[0];
        item = item.substring(item.match(/supply[" "]*of[^\w]*/i)[0].length, item.length);
    }

    // FOR : Deaprtment of .., (no comma in dept name & comma after dept name)
    const deptRgx = /for[" ":]*department of[" "]*[\w" "\d]*/i;
    let dept = str.match(deptRgx);
    if (dept != null) {
        dept = dept[0];
        dept = dept.substring(dept.match(/for[" ":]*department of[" "]*/i)[0].length, dept.length);
    }

    // M/s supplier
    const supRgx = /M\/s[^,\n]*/i;
    let supplier = str.match(supRgx);
    if (supplier != null) {
        supplier = supplier[0];
    }

    // CC to : Indentator   
    const indRgx = /cc[" "]*to[" ":]*\n1.[" "\w.]*/i;
    let indentator = str.match(indRgx);
    if (indentator != null) {
        indentator = indentator[0];
        indentator = indentator.substring(indentator.match(/cc[" "]*to[" ":]*\n1.[" "]*/i)[0].length, indentator.length);
    }
    
    let info = {
        date: date,
        amount: amount,
        PO: PO,
        item: item,
        dept: dept,
        supplier: supplier,
        indentator: indentator
    };
    console.log(info);

});
