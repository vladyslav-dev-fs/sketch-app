// src/items/item.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ItemService } from './providers/item.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Item } from './item.entity';
import { CreateItemDto } from 'src/items/dtos/create-item.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { User } from 'src/users/user.entity';

@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async get(): Promise<Item[]> {
    return this.itemService.getAllItems();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Item created successfully.',
    type: Item,
  })
  async create(
    @Body() createItemDto: CreateItemDto,
    @ActiveUser() user: User,
  ): Promise<Item> {
    return this.itemService.createItem(createItemDto, user);
  }
}
