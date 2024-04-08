import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateShortUrlDTO, getLongUrlDTO } from 'src/models';
import { ShotnerService } from 'src/services/shortner';

@ApiTags('Url-Shortner')
@Controller('shortner')
export class ShortnerController {
  constructor(private shortnerService: ShotnerService) {}

  @Post('shorten')
  async shortenUrl(@Body() url: CreateShortUrlDTO): Promise<any> {
    return await this.shortnerService.shortenUrl(url);
  }

  @Get('shortUrl')
  async redirectToLongUrl(
    @Query('shortUrl') url: string,
    @Res() res: Response,
  ): Promise<any> {
    const packet: getLongUrlDTO = {
      shortURL: url,
    };
    const result = await this.shortnerService.getLongUrl(packet);
    if (!result.data) {
      return {
        message: 'NO Url found , please try with a different one',
      };
    }

    res.redirect(`${result.data}`);
  }
}
