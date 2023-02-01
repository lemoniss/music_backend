import { EntityRepository, getConnection, getManager, getRepository, Repository } from "typeorm";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
import { BannerEntity } from "../entity/banner.entity";
import { CreateBannerDataDto } from "../dto/create.bannerdata.dto";
import { ResponseBannerDataDto } from "../dto/response.bannerdata.dto";
import { NftMusicEntity } from "../../nftmusic/entity/nftmusic.entity";

@EntityRepository(BannerEntity)
export class BannerRepository extends Repository<BannerEntity> {

  /**
   * 음악 정보 생성
   * @param createUserDto
   */
  async createBanner(createBannerDataDto: CreateBannerDataDto): Promise<number> {
    try {

      // const bannerEntity = await this.save({
      //   lang: createBannerDataDto.lang,
      //   title: createBannerDataDto.title,
      //   subTitle: createBannerDataDto.subTitle == '' || typeof createBannerDataDto.subTitle == 'undefined' ? null : createBannerDataDto.subTitle,
      //   contents: createBannerDataDto.contents,
      //   viewYn: 'Y',
      //   order: 1,
      //   host: createBannerDataDto.host == '' || typeof createBannerDataDto.host == 'undefined' ? null : createBannerDataDto.host,
      //   eventAt: createBannerDataDto.eventAt == '' || typeof createBannerDataDto.eventAt == 'undefined' ? null : createBannerDataDto.eventAt,
      //   location: createBannerDataDto.location == '' || typeof createBannerDataDto.location == 'undefined' ? null : createBannerDataDto.location,
      //   btnText: createBannerDataDto.btnText,
      //   type: createBannerDataDto.type == '' || typeof createBannerDataDto.type == 'undefined' ? null : createBannerDataDto.type,
      //   extra: createBannerDataDto.extra == '' || typeof createBannerDataDto.extra == 'undefined' ? null : createBannerDataDto.extra,
      // });
      // return bannerEntity.id;

      const banner = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(BannerEntity)
        .values({
          lang: createBannerDataDto.lang,
          title: createBannerDataDto.title,
          subTitle: createBannerDataDto.subTitle == '' || typeof createBannerDataDto.subTitle == 'undefined' ? null : createBannerDataDto.subTitle,
          contents: createBannerDataDto.contents,
          viewYn: 'Y',
          order: 1,
          host: createBannerDataDto.host == '' || typeof createBannerDataDto.host == 'undefined' ? null : createBannerDataDto.host,
          eventAt: createBannerDataDto.eventAt == '' || typeof createBannerDataDto.eventAt == 'undefined' ? null : createBannerDataDto.eventAt,
          location: createBannerDataDto.location == '' || typeof createBannerDataDto.location == 'undefined' ? null : createBannerDataDto.location,
          btnText: createBannerDataDto.btnText,
          type: createBannerDataDto.type == '' || typeof createBannerDataDto.type == 'undefined' ? null : createBannerDataDto.type,
          extra: createBannerDataDto.extra == '' || typeof createBannerDataDto.extra == 'undefined' ? null : createBannerDataDto.extra,
        })
        .execute();

      return banner.raw.insertId;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }

  async getLaunchAppBanners(lang: string): Promise<ResponseBannerDataDto[]> {
    const bannerList = await getRepository(BannerEntity)
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.bannerFileEntity', 'bf')
      .leftJoinAndSelect('bf.fileEntity', 'f')
      .where('b.viewYn = :viewYn', {viewYn: 'Y'})
      .andWhere('b.type in (:bannerType)' , {bannerType: ['W', 'M']})
      .andWhere('b.lang = :lang', {lang: lang})
      .orderBy('b.order', 'ASC')
      .getMany();
    if (!bannerList) {
      let responseList = [];
      const responseObj = new ResponseBannerDataDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];
    for(const banner of bannerList) {
      const responseBannerDataDto = new ResponseBannerDataDto();

      responseBannerDataDto.id = Number(banner.id);
      responseBannerDataDto.lang = banner.lang;
      responseBannerDataDto.title = banner.title;
      responseBannerDataDto.subTitle = banner.subTitle;
      responseBannerDataDto.contents = banner.contents;
      responseBannerDataDto.fileUrl = banner.bannerFileEntity[0].fileEntity.url;
      responseBannerDataDto.host = banner.host;
      responseBannerDataDto.eventAt = banner.eventAt;
      responseBannerDataDto.location = banner.location;
      responseBannerDataDto.btnText = banner.btnText;
      responseBannerDataDto.type = banner.type;
      responseBannerDataDto.extra = banner.extra;
      responseList.push(responseBannerDataDto);
    }
    return responseList;
  }

  async getBanners(lang: string): Promise<ResponseBannerDataDto[]> {
    const bannerList = await getRepository(BannerEntity)
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.bannerFileEntity', 'bf')
      .leftJoinAndSelect('bf.fileEntity', 'f')
      .where('b.viewYn = :viewYn', {viewYn: 'Y'})
      .andWhere('b.type not in (:bannerType)' , {bannerType: ['W', 'M']})
      .andWhere('b.lang = :lang', {lang: lang})
      .orderBy('b.order', 'ASC')
      .getMany();
    if (!bannerList) {
      let responseList = [];
      const responseObj = new ResponseBannerDataDto();
      responseList.push(responseObj);
      return responseList;
    }

    let responseList = [];
    for(const banner of bannerList) {
      const responseBannerDataDto = new ResponseBannerDataDto();

      responseBannerDataDto.id = Number(banner.id);
      responseBannerDataDto.lang = banner.lang;
      responseBannerDataDto.title = banner.title;
      responseBannerDataDto.subTitle = banner.subTitle;
      responseBannerDataDto.contents = banner.contents;
      responseBannerDataDto.fileUrl = banner.bannerFileEntity[0].fileEntity.url;
      responseBannerDataDto.host = banner.host;
      responseBannerDataDto.eventAt = banner.eventAt;
      responseBannerDataDto.location = banner.location;
      responseBannerDataDto.btnText = banner.btnText;
      responseBannerDataDto.type = banner.type;
      responseBannerDataDto.extra = banner.extra;
      responseList.push(responseBannerDataDto);
    }
    return responseList;
  }

  async getBanner(bannerId: number, userId: number): Promise<ResponseBannerDataDto> {
    const banner = await getRepository(BannerEntity)
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.bannerFileEntity', 'bf')
      .leftJoinAndSelect('bf.fileEntity', 'f')
      .leftJoinAndSelect('b.bannerLikeEntity', 'bl')
      .leftJoinAndSelect('bl.userEntity', 'u')
      .where('b.id = :bannerId', {bannerId: bannerId})
      .getOne();
    if (!banner) {
      return new ResponseBannerDataDto();
    }

    const responseBannerDataDto = new ResponseBannerDataDto();

    responseBannerDataDto.id = Number(banner.id);
    responseBannerDataDto.lang = banner.lang;
    responseBannerDataDto.title = banner.title;
    responseBannerDataDto.subTitle = banner.subTitle;
    responseBannerDataDto.contents = banner.contents;
    responseBannerDataDto.fileUrl = banner.bannerFileEntity[0].fileEntity.url;
    responseBannerDataDto.host = banner.host;
    responseBannerDataDto.eventAt = banner.eventAt;
    responseBannerDataDto.location = banner.location;
    responseBannerDataDto.btnText = banner.btnText;
    responseBannerDataDto.type = banner.type;
    responseBannerDataDto.extra = banner.extra;
    responseBannerDataDto.likeCount = Number(banner.bannerLikeEntity.length);
    responseBannerDataDto.existMe = false;

    for(const like of banner.bannerLikeEntity) {
      if(like.userEntity.id == userId) {
        responseBannerDataDto.existMe = true;
        break;
      }
    }

    return responseBannerDataDto;
  }

  async updateBanner(bannerId: number, createBannerDataDto: CreateBannerDataDto): Promise<boolean> {
    try {

      const bannerEntity = await this.findOne(bannerId);
      // const bannerEntity = await this.findOneById(bannerId);

      // await this.update({ id: bannerId }, {
      //   lang: createBannerDataDto.lang == '' || typeof createBannerDataDto.lang == 'undefined' ? bannerEntity.lang : createBannerDataDto.lang,
      //   title: createBannerDataDto.title == '' || typeof createBannerDataDto.title == 'undefined' ? bannerEntity.title : createBannerDataDto.title,
      //   subTitle: createBannerDataDto.subTitle == '' || typeof createBannerDataDto.subTitle == 'undefined' ? bannerEntity.subTitle : createBannerDataDto.subTitle,
      //   contents: createBannerDataDto.contents == '' || typeof createBannerDataDto.contents == 'undefined' ? bannerEntity.contents : createBannerDataDto.contents,
      //   viewYn: createBannerDataDto.viewYn == '' || typeof createBannerDataDto.viewYn == 'undefined' ? bannerEntity.viewYn : createBannerDataDto.viewYn,
      //   order: typeof createBannerDataDto.order == 'undefined' ? bannerEntity.order : createBannerDataDto.order,
      //   host: createBannerDataDto.host == '' || typeof createBannerDataDto.host == 'undefined' ? bannerEntity.host : createBannerDataDto.host,
      //   eventAt: createBannerDataDto.eventAt == '' || typeof createBannerDataDto.eventAt == 'undefined' ? bannerEntity.eventAt : createBannerDataDto.eventAt,
      //   location: createBannerDataDto.location == '' || typeof createBannerDataDto.location == 'undefined' ? bannerEntity.location : createBannerDataDto.location,
      //   btnText: createBannerDataDto.btnText == '' || typeof createBannerDataDto.btnText == 'undefined' ? bannerEntity.btnText : createBannerDataDto.btnText,
      //   type: createBannerDataDto.type == '' || typeof createBannerDataDto.type == 'undefined' ? bannerEntity.type : createBannerDataDto.type,
      //   extra: createBannerDataDto.extra == '' || typeof createBannerDataDto.extra == 'undefined' ? bannerEntity.extra : createBannerDataDto.extra,
      // });

      await getConnection()
        .createQueryBuilder()
        .update(BannerEntity)
        .set({
          lang: createBannerDataDto.lang == '' || typeof createBannerDataDto.lang == 'undefined' ? bannerEntity.lang : createBannerDataDto.lang,
          title: createBannerDataDto.title == '' || typeof createBannerDataDto.title == 'undefined' ? bannerEntity.title : createBannerDataDto.title,
          subTitle: createBannerDataDto.subTitle == '' || typeof createBannerDataDto.subTitle == 'undefined' ? bannerEntity.subTitle : createBannerDataDto.subTitle,
          contents: createBannerDataDto.contents == '' || typeof createBannerDataDto.contents == 'undefined' ? bannerEntity.contents : createBannerDataDto.contents,
          viewYn: createBannerDataDto.viewYn == '' || typeof createBannerDataDto.viewYn == 'undefined' ? bannerEntity.viewYn : createBannerDataDto.viewYn,
          order: typeof createBannerDataDto.order == 'undefined' ? bannerEntity.order : createBannerDataDto.order,
          host: createBannerDataDto.host == '' || typeof createBannerDataDto.host == 'undefined' ? bannerEntity.host : createBannerDataDto.host,
          eventAt: createBannerDataDto.eventAt == '' || typeof createBannerDataDto.eventAt == 'undefined' ? bannerEntity.eventAt : createBannerDataDto.eventAt,
          location: createBannerDataDto.location == '' || typeof createBannerDataDto.location == 'undefined' ? bannerEntity.location : createBannerDataDto.location,
          btnText: createBannerDataDto.btnText == '' || typeof createBannerDataDto.btnText == 'undefined' ? bannerEntity.btnText : createBannerDataDto.btnText,
          type: createBannerDataDto.type == '' || typeof createBannerDataDto.type == 'undefined' ? bannerEntity.type : createBannerDataDto.type,
          extra: createBannerDataDto.extra == '' || typeof createBannerDataDto.extra == 'undefined' ? bannerEntity.extra : createBannerDataDto.extra,
        })
        .where('id = :bannerId', {bannerId: bannerId})
        .execute();
      return true;
    } catch (e) {
      throw new RuntimeException('Server Error. Please try again later.');
    }
  }
}
