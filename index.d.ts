/**
 * Author: Luca Lindhorst <info@lucalindhorst.de>
 * Copyright: Luca Lindhorst 2018
 */

export function EVP_BytesToKey (password: string|Buffer, salt: string|Buffer, keyLen: number, hashName: string = "SHA256", ivLen: number = 0) : {key:Buffer, iv: Buffer};
export function opensslEncBuf(algo: string, inp: Buffer, pw: string, useSalt: boolean = true) : Buffer;