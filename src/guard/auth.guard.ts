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
      const headerAuthToken = request.header('auth_token');
      const privateKey = fs.readFileSync('./private_key.pem', {encoding: 'utf-8'});
      const decryptToken = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
          oaepLabel: 'millim-x',
        }, Buffer.from(headerAuthToken, 'base64')
      );
      const decryptTokenStr = Buffer.from(decryptToken.buffer).toString();
      const map = new Map(Object.entries(JSON.parse(decryptTokenStr)));

      // const serverTime = Math.round(new Date().getTime() / 1000);

      // const now = new Date()
      // const utcMilllisecondsSinceEpoch = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
      // const serverTime = Math.round(utcMilllisecondsSinceEpoch / 1000)

      // const authInfo = await this.userService.findByIdAndAddress(Number(map.get('userId')), map.get('address').toString());

      const authInfo = await this.userService.findByAddress(map.get('address').toString());


      console.log()

      if (authInfo.id == 0) {
        return false;
        // throw new UnauthorizedException();
      }

      return true;
    } catch (e) {
      return false;
    }

  }
}
