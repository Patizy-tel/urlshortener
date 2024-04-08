import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlShortener, urlShortenerSchema } from './models';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsService } from './services';
import { ShornerService } from './services/shortner';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UrlShortener.name, schema: urlShortenerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, UtilsService, ShornerService],
})
export class AppModule {}
