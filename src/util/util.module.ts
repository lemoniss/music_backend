import { Module } from '@nestjs/common';
import { Rsa } from "./rsa";
import { Formatter } from "./formatter";

@Module({
  providers: [
    Rsa,
    Formatter,
  ],
  exports: [
    Rsa,
    Formatter,
  ],
})
export class UtilModule {}
