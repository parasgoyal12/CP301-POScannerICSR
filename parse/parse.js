const fs = require('fs');

fs.readFile('res1.json', (err, data) => {
    if (err) throw err;

    // res1
    let str = JSON.parse(data);
    str = str.text;

    // res2
    // let str = JSON.parse(data).fullTextAnnotation.text;


    // Assumptions for rgx in comments, won't work without these

    // xx.xx.xxxx format, First instance is always date (as in samples)
    const dateRgx = /\d{2}[.]\d{2}[.]\d{4}/;
    const date = (str.match(dateRgx))[0];

    // Total\nAmt
    const amountRgx = /Total[" "-:;]*[\n]*[\d,.]*/; 
    let amount = (str.match(amountRgx))[0];
    amount = amount.substring(amount.match(/[\d]/).index, amount.length);

    // PO number starts with digit and ??
    const PONoRgx = /PO No[.:\n]*[" "]*[\d-,/\w]*/;
    let PO = (str.match(PONoRgx))[0];
    PO = PO.substring(PO.search(/[\d]/), PO.length);

    // Supple of 'item'
    const itemRgx = /Supply[" "]*of[" "-.:,']*[\w" "\d-.,:]*'/;
    let item = (str.match(itemRgx))[0];
    item = item.substring(item.match(/Supply[" "]*of[" "-.:,']*/)[0].length, item.length - 1);
    // item = item.substring(item.search(/'/) + 1, item.length - 1);

    // FOR : Deaprtment of .., (no comma in dept name & comma after dept name)
    const deptRgx = /FOR[" ":]*Department of[" "]*[\w" "\d]*/;
    let dept = (str.match(deptRgx))[0];
    dept = dept.substring(dept.match(/FOR[" ":]*Department of[" "]*/)[0].length, dept.length);

    // M/s supplier
    const supRgx = /[Mm]\/[Ss][" "\w\d]*/;
    let supplier = (str.match(supRgx))[0];

    // CC to : Indentator
    const indRgx = /[cC]{2}[" "]*[tT][Oo][" ":]*\n1.[" "\w.]*/;
    let indentator = (str.match(indRgx))[0];
    indentator = indentator.substring(indentator.match(/[cC]{2}[" "]*[tT][Oo][" ":]*\n1.[" "]*/)[0].length, indentator.length);

    console.log(date, '\n', amount, '\n', PO, '\n', item, '\n', dept, '\n', supplier, '\n', indentator);
});