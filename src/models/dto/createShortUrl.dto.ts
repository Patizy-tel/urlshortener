import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateShortUrlDTO {
  @ApiProperty({
    description: 'URl to be converted ',
    example: '',
  })
  @IsNotEmpty()
  @IsUrl()
  longURL: string;
}
