import { EntityRepository, getConnection, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { UpdateUserDto } from "../dto/update.user.dto";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { UserFileEntity } from "../entity/user_file.entity";
import { FileEntity } from "../entity/file.entity";

@EntityRepository(UserFileEntity)
export class UserFileRepository extends Repository<UserFileEntity> {

  /**
   * 사용자 파일 관계데이터 생성
   * @param updateUserDto
   */
  async createUserFile(id: number, updateUserDto: UpdateUserDto, fileType: string): Promise<boolean> {
    try {

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserFileEntity)
        .where('userEntity = :userId', {userId: id})
        .andWhere('fileType = :fileType', {fileType: fileType})
        .execute();

      const userEntity = new UserEntity();
      userEntity.id = id;

      // const fileEntity = new FileEntity();
      // fileEntity.id = updateUserDto.fileId;

      const fileEntity = new FileEntity();
      fileEntity.id = fileType == 'PROFILE' ? updateUserDto.profileFileId : updateUserDto.bannerFileId;

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserFileEntity)
        // .where('userEntity = :userId', {userId: id})
        .values({
          userEntity: userEntity,
          fileEntity: fileEntity,
          fileType: fileType,
        })
        .execute();

      // await this.save({
      //   userEntity: userEntity,
      //   fileEntity: fileEntity,
      // });
      return true;
    } catch (e) {
      console.log(e);
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
