let ofe = require('./index.js');

let fs = require('fs');

let buf = fs.readFileSync('LICENSE');
fs.writeFileSync('LICENSE.enc', ofe.opensslEncBuf("aes-128-cbc", buf, "Hallo"));