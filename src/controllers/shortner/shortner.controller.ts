import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateShortUrlDTO } from 'src/models';
import { ShotnerService } from 'src/services/shortner';

@ApiTags('Url-Shortner')
@Controller('shortner')
export class ShortnerController {
  constructor(private shortnerService: ShotnerService) {}

  @Post('shorten')
  async shortenUrl(@Body() url: CreateShortUrlDTO): Promise<any> {
    return await this.shortnerService.shortenUrl(url);
  }
}
