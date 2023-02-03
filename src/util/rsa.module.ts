import { Module } from '@nestjs/common';
import { Rsa } from "./rsa";

@Module({
  providers: [
    Rsa,
  ],
  exports: [Rsa,],
})
export class RsaModule {}
