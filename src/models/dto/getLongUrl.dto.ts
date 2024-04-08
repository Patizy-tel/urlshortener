import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class getLongUrlDTO {
  @ApiProperty({
    description: 'URl converted ',
    example: '',
  })
  @IsNotEmpty()
  shortURL: string;
}
