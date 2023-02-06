import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { ShowtimeEntity } from "../entity/showtime.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { ShowtimeCrewEntity } from "../entity/showtime_crew.entity";
import { CreateShowTimeCrewDto } from "../dto/create.showtimecrew.dto";
import { UserEntity } from "../entity/user.entity";
import { NftMusicEntity } from "../../nftmusic/entity/nftmusic.entity";
import { ResponseArtistDto } from "../dto/response.artist.dto";
import { UserOtpEntity } from "../../user/entity/user_otp.entity";

@EntityRepository(ShowtimeCrewEntity)
export class ShowtimeCrewRepository extends Repository<ShowtimeCrewEntity> {

  /**
   * 쇼타임 제작진 정보 생성
   * @param createShowTimeDto
   */
  async createShowtimeCrew(showtimeId: number) {
    try {
      const showtimeEntity = new ShowtimeEntity();
      showtimeEntity.id = showtimeId;

      const artistUser = new UserEntity();
      artistUser.id = 1;
      // await this.save({
      //   showtimeEntity: showtimeEntity,
      //   userEntity: artistUser,
      //   name: 'A',
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ShowtimeCrewEntity)
        .values({
          showtimeEntity: showtimeEntity,
          userEntity: artistUser,
          name: 'A',
        })
        .execute();

      const producerUser = new UserEntity();
      producerUser.id = 1;
      // await this.save({
      //   showtimeEntity: showtimeEntity,
      //   userEntity: artistUser,
      //   name: 'P',
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ShowtimeCrewEntity)
        .values({
          showtimeEntity: showtimeEntity,
          userEntity: artistUser,
          name: 'P',
        })
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
