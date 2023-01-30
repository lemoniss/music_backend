import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { UpdateUserDto } from "../dto/update.user.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserOtpEntity } from "../entity/user_otp.entity";
import { InfoUserDto } from "../dto/info.user.dto";
import { ResponseOtpUserDto } from "../dto/response.otp.user.dto";
import { NftMusicGenreEntity } from "../../nftmusic/entity/nftmusic_genre.entity";

@EntityRepository(UserOtpEntity)
export class UserOtpRepository extends Repository<UserOtpEntity> {

  /**
   * 사용자 파일 관계데이터 생성
   * @param updateUserDto
   */
  async createUserOtp(id: number, secret: string) {
    try {

      const userEntity = new UserEntity();
      userEntity.id = id;

      // await this.save({
      //   userEntity: userEntity,
      //   secret: secret,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserOtpEntity)
        .values({
          userEntity: userEntity,
          secret: secret,
        })
        .execute();

    } catch (e) {
      console.log(e);
      throw new RuntimeException('createUserOtp Server Error. Please try again later.');
    }
  }

  // 최초 사용자데이터 존재여부 검색시 사용
  async findByUserId(id: number): Promise<ResponseOtpUserDto> {
    const otp = await getRepository(UserOtpEntity)
      .createQueryBuilder('otp')
      .innerJoinAndSelect('otp.userEntity', 'u')
      .where('otp.userEntity = :userId', {userId: id})
      .getOne();

    const responseOtpUserDto = new ResponseOtpUserDto();
    if(otp) {
      responseOtpUserDto.userId = otp.userEntity.id;
      responseOtpUserDto.secret = otp.secret;
      responseOtpUserDto.isFirst = false;
    }
    return responseOtpUserDto;
  }
}
