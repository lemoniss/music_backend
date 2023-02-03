import fs from "fs";
import crypto from "crypto";

export class Rsa {

  static decryptAddress(authToken: string) : string {
    const privateKey = fs.readFileSync('./private_key.pem', {encoding: 'utf-8'});
    const decryptToken = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      }, Buffer.from(authToken, 'base64')
    );
    return Buffer.from(decryptToken.buffer).toString();
  }

}
