// src/items/dto/create-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'iPhone 11 Pro Max' })
  item: string;

  @ApiProperty({
    example: 'Apple iPhone 11 Pro Max with triple cameras and 512GB storage',
  })
  itemDescription: string;
}
