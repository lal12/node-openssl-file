/**
 * Author: Luca Lindhorst <info@lucalindhorst.de>
 * Copyright: Luca Lindhorst 2018
 */

const crypto = require('crypto');
const createCipher = crypto.createCipher;
const createCipheriv = crypto.createCipheriv;
const createHash = crypto.createHash;
const randomBytes = crypto.randomBytes;

function getBlockSize(algo){
    let c = createCipher(algo, Buffer.alloc(64));
    return c.final().length;
}

function EVP_BytesToKey (password, salt, keyLen, hashName, ivLen) {
    if (!Buffer.isBuffer(password)) 
        password = Buffer.from(password, 'ascii')
    if (salt) {
      if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, 'ascii')
    }
    
    ivLen = ivLen || 0;
    var key = new Buffer(keyLen)
    var iv = new Buffer(ivLen)
    var tmp = new Buffer(0)
  
    while (keyLen > 0 || ivLen > 0) {
        let hash = createHash(hashName);
        hash.update(tmp)
        hash.update(password)
        if (salt)
            hash.update(salt)
          tmp = hash.digest()
  
          var used = 0
  
        if (keyLen > 0) {
            var keyStart = key.length - keyLen;
            used = Math.min(keyLen, tmp.length);
            tmp.copy(key, keyStart, 0, used);
            keyLen -= used;
        }
        if (used < tmp.length && ivLen > 0) {
            var ivStart = iv.length - ivLen;
            var length = Math.min(ivLen, tmp.length - used);
            tmp.copy(iv, ivStart, used, used + length);
            ivLen -= length;
        }
    }
    tmp.fill(0)
    return { key: key, iv: iv }
}

function opensslEncBuf(algo, inp, pw, useSalt){
    let salt;
    let blockSize = getBlockSize(algo);
    if(useSalt !== false)
        salt = randomBytes(8);
    let magic = ""; 
    if(salt)
        magic = "Salted__";
    let {key, iv} = EVP_BytesToKey(pw, salt, blockSize, "md5", blockSize);
    let offs = 0;
    let encryptedDataSize;
    if(!inp.length){
        encryptedDataSize = blockSize;
    }else{
        encryptedDataSize = Math.ceil(inp.length / blockSize) * blockSize;
    }
    let b = Buffer.alloc(magic.length + (salt ? salt.length : 0) + encryptedDataSize);
    if(salt){
        offs += b.write(magic, 0, magic.length, "ascii");
        offs += salt.copy(b, offs);
    }
    let c = createCipheriv(algo, key, iv);
    offs += c.update(inp).copy(b, offs);
    offs += c.final().copy(b, offs);
    return b;
}

module.exports = {};
module.exports.EVP_BytesToKey = EVP_BytesToKey;
module.exports.opensslEncBuf = opensslEncBuf;