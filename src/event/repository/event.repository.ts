import { EntityRepository, getConnection, getManager, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { EventEntity } from "../entity/event.entity";
import { SaveEventDto } from "../dto/save.event.dto";

@EntityRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {

  /**
   * Cnut조회
   * @param userId
   */
  async findByEvent(code: string, userId: number): Promise<number> {
    const entityManager = getManager();
    const eventObj = await entityManager.query(
      'select sequence ' +
      'from event ' +
      'where code = ? and user_id = ?'
      , [code, userId]);

    if(eventObj.length > 0) {
      return eventObj[0].sequence;
    } else {
      return 0;
    }
  }

  async saveEvent(saveEventDto: SaveEventDto): Promise<number> {
    try {

      if(await this.findByEvent(saveEventDto.code, saveEventDto.userId) > 0) {
        return 0;
      }

      const entityManager = getManager();
      const eventObj = await entityManager.query(
        'select ifnull(max(sequence), 0) as sequence from event'
      );

      const sequence = Number(eventObj[0].sequence) + 1;

      const userEntity = new UserEntity();
      userEntity.id = saveEventDto.userId;

      // await this.save({
      //   code: saveEventDto.code,
      //   name: saveEventDto.name,
      //   status: 'T',
      //   sequence: sequence,
      //   userEntity: userEntity,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(EventEntity)
        .values({
          code: saveEventDto.code,
          name: saveEventDto.name,
          status: 'T',
          sequence: sequence,
          userEntity: userEntity,
        })
        .execute();

      return this.findByEvent(saveEventDto.code, userEntity.id);
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
