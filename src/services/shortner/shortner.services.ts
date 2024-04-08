import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShortUrlDTO, UrlShortener, getLongUrlDTO } from 'src/models';
import { UtilsService } from '../utils';

@Injectable()
export class ShotnerService {
  constructor(
    @InjectModel(UrlShortener.name)
    private readonly shortnerModel: Model<UrlShortener>,
    private utilsService: UtilsService,
  ) {}

  async shortenUrl(url: CreateShortUrlDTO): Promise<any> {
    try {
      //check if url is already converted to short url
      const checkifExist = await this.shortnerModel.find({
        longURL: url.longURL.toString(),
      });
      if (checkifExist.length > 0) {
        return new HttpException('url already converted', 400);
      }

      const packet: Partial<UrlShortener> = {
        longURL: url.longURL.toString(),
        shortURL: this.utilsService.generateRandomId(12),
      };
      const result = await this.shortnerModel.create(packet);
      return {
        message: 'url converted successfully',
        data: result,
      };
    } catch (error) {
      return new HttpException(error.message, 500);
    }
  }

  async getLongUrl(URL: getLongUrlDTO): Promise<any> {
    try {
      const url = await this.shortnerModel.findOne({
        shortURL: URL.shortURL.toString(),
      });

      if (!url) {
        return {
          message: 'url not found',
          data: null,
        };
      }
      url.clicks++;
      await url.save();
      return {
        message: 'url found',
        data: url.longURL,
      };
    } catch (error) {
      return new HttpException(error.message, 500);
    }
  }

  async getClicks(shortURL: string): Promise<number> {
    const record = await this.shortnerModel.findOne({ shortURL });
    return record ? record.clicks : 0;
  }
}
