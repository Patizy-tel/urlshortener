import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlShortener, urlShortenerSchema } from './models';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsService } from './services';
import { ShotnerService } from './services/shortner';
import { ShortnerController } from './controllers';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from './helpers';

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
  controllers: [AppController, ShortnerController],
  providers: [
    AppService,
    ConfigService,
    UtilsService,
    ShotnerService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {}
