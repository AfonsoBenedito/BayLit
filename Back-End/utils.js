function isString (str) {
    return (typeof str === 'string' || str instanceof String)
}

function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}

function isNumber(value) {
    return !isNaN(value) && parseFloat(value)
}

function uniqueValuesArray(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

function convertToCSV(objArray) {

    var json = objArray
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value } 
    var csv = json.map(function(row){
    return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
    }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    
    return csv
}

module.exports = {
    isString,
    isInt,
    isNumber,
    uniqueValuesArray,
    convertToCSV
}