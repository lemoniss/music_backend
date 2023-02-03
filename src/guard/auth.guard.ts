import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Observable } from 'rxjs';
import { Request } from 'express';

const crypto = require("crypto");
const fs = require('fs');

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request) {
    try {
      const headerAuthToken = request.header('auth_token').toString();
      console.log(headerAuthToken);
      const privateKey = fs.readFileSync('./private_key.pem', {encoding: 'utf-8'});
      const decryptToken = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(headerAuthToken, 'base64')
      );
      const decryptAddress = Buffer.from(decryptToken.buffer).toString();

      // const serverTime = Math.round(new Date().getTime() / 1000);

      // const now = new Date()
      // const utcMilllisecondsSinceEpoch = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
      // const serverTime = Math.round(utcMilllisecondsSinceEpoch / 1000)

      // const authInfo = await this.userService.findByIdAndAddress(Number(map.get('userId')), map.get('address').toString());

      const authInfo = await this.userService.findByAddress(decryptAddress.toString());


      console.log()

      if (authInfo.id == 0) {
        return false;
        // throw new UnauthorizedException();
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }

  }

  // function strToab(encText) {
  //   let buf = new ArrayBuffer(encText.length*2); // 2 bytes for each char
  //   let bufView = new Uint8Array(buf);
  //   for (let i=0, strLen=encText.length; i < strLen; i++) {
  //     bufView[i] = encText.charCodeAt(i);
  //   }
  //   return buf;
  // }

}
