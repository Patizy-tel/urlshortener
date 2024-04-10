import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async redirectToLongUrl(@Query('shortUrl') url: string): Promise<any> {
    const packet: getLongUrlDTO = {
      shortURL: url,
    };
    const result = await this.shortnerService.getLongUrl(packet);
    if (!result.data) {
      return {
        message: 'NO Url found , please try with a different one',
      };
    }

    return result.data;
  }

  @Get('/clicks')
  async getClicks(
    @Query('shortURL') shortURL: string,
  ): Promise<{ clicks: number }> {
    const clicks = await this.shortnerService.getClicks(shortURL);
    return { clicks };
  }

  @Get('/paginated-results')
  async getPaginatedResults(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    // Convert query params to numbers and set defaults if necessary
    const pageNum = parseInt(page.toString(), 10) || 1;
    const pageSizeNum = parseInt(pageSize.toString(), 10) || 10;

    return this.shortnerService.getallShortUrlsPaginated(pageNum, pageSizeNum);
  }

  @Get('/statistics')
  async getStatistics(): Promise<any> {
    const results = await this.shortnerService.getTotalUrlCreatedEachDay();
    return { results };
  }
}
