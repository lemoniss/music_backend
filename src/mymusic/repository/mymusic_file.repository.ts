import { EntityRepository, getConnection, getRepository, Repository } from "typeorm";
import { MyMusicEntity } from "../entity/mymusic.entity";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { CreateMusicDto } from "../dto/create.music.dto";
import { MyMusicFileEntity } from "../entity/mymusic_file.entity";
import { FileEntity } from "../entity/file.entity";
import { UpdateMusicDto } from "../dto/update.music.dto";

@EntityRepository(MyMusicFileEntity)
export class MyMusicFileRepository extends Repository<MyMusicFileEntity> {

  /**
   * 음악_파일 정보 생성
   * @param createUserDto
   */
  async createMusicFile(myMusicId: number, createMusicDto: CreateMusicDto) {
    try {
      const myMusicEntity = new MyMusicEntity();
      myMusicEntity.id = myMusicId;

      const fileEntity = new FileEntity();
      fileEntity.id = createMusicDto.musicFileId;

      // await this.save({
      //   myMusicEntity: myMusicEntity,
      //   fileEntity: fileEntity,
      //   fileType: 'MUSIC',
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(MyMusicFileEntity)
        .values({
          myMusicEntity: myMusicEntity,
          fileEntity: fileEntity,
          fileType: 'MUSIC',
        })
        .execute();

      if(typeof createMusicDto.imgFileId != 'undefined' && createMusicDto.imgFileId != 0) {
        fileEntity.id = createMusicDto.imgFileId;

        // await this.save({
        //   myMusicEntity: myMusicEntity,
        //   fileEntity: fileEntity,
        //   fileType: 'IMAGE',
        // });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(MyMusicFileEntity)
          .values({
            myMusicEntity: myMusicEntity,
            fileEntity: fileEntity,
            fileType: 'IMAGE',
          })
          .execute();
      }

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악_파일 정보 갱신 (음악파일수정시)
   * @param updateMusicDto
   */
  async updateMusicFile(myMusicId: number, updateMusicDto: UpdateMusicDto, fileType: string) {
    try {
      const myMusicEntity = new MyMusicEntity();
      myMusicEntity.id = myMusicId;

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(MyMusicFileEntity)
        .where('myMusicEntity = :myMusicId', {myMusicId: myMusicId})
        .andWhere('fileType = :fileType', {fileType: fileType})
        .execute();

      const fileEntity = new FileEntity();
      fileEntity.id = fileType == 'MUSIC' ? updateMusicDto.musicFileId : updateMusicDto.imgFileId;

      // await this.save({
      //   myMusicEntity: myMusicEntity,
      //   fileEntity: fileEntity,
      //   fileType: fileType,
      // });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(MyMusicFileEntity)
        .values({
          myMusicEntity: myMusicEntity,
          fileEntity: fileEntity,
          fileType: fileType,
        })
        .execute();



    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  /**
   * 음악_파일 삭제
   * @param myMusicId
   */
  async deleteMusicFile(myMusicId: number) {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(MyMusicFileEntity)
        .where('myMusicEntity = :myMusicId', {myMusicId: myMusicId})
        .execute();

    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

}
