# node-openssl-file
A Javascript library for node, to enable it to encrypt and decrypt files in a openssl compatible way.
Decryption is not yet implemented but shoud be very little work to add it.
This libary uses the old way of generating the key from the password, which is now considered insecure, 
so only use this library for compatibility reasons. The key now should be generated with PBKDF2, if need more information, look into the node docs for 
[crypto.pbkdf2](https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback) and 
[crypto.createCipher](https://nodejs.org/api/crypto.html#crypto_crypto_createcipher_algorithm_password_options).

## Functions
`EVP_BytesToKey (password: string|Buffer, salt: string|Buffer|null, keyLen: number, hashName: string = "SHA256", ivLen = 0)`
This function works exactly like the same named openssl function: [EVP_BytesToKey](https://www.openssl.org/docs/man1.0.2/crypto/EVP_BytesToKey.html).
- `password`: a buffer or a string (which is converted to a buffer via ascii encoding, so do not use utf8 characters)
- `salt`: a buffer or a string with byte length 8, if it is null no salt is used
- `keyLen`: the length of the needed key
- `hashName`: the hash to be used for key generation, has to be supported by crypto.createHash
- `ivLen`: the length of the needed IV (initialization vector)
- *returns*: {key: Buffer, iv: Buffer}

`opensslEncBuf(algo: string, inp: Buffer, pw: string, useSalt: bool = true)`
This function works like calling `openssl {algo} -e -k {pw} -salt`.
- `algo`: is the encryption algorithm e.g. `bf` (blowfish), must be supported by crypto.createCipheriv
- `inp`: is the data to be encrypted
- `pw`: is the password to encrypt with
- `useSalt`: if you don't want to use a salt, pass false. This is like ommiting the `-salt` parameter when calling openssl.
- *returns*: A Buffer containing the encrypted data
