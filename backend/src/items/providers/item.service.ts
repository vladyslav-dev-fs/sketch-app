// src/items/item.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../item.entity';
import { CreateItemDto } from 'src/items/dtos/create-item.dto';
import { OpenAIProvider } from 'src/items/providers/openai.provider';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly openAIService: OpenAIProvider,
    private readonly usersService: UsersService,
  ) {}

  async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const { item, itemDescription } = createItemDto;
    const prompt = `Generate a detailed description of the following product: ${item} - ${itemDescription}`;

    const aiDescription = await this.openAIService.generateDescription(prompt);

    const userFromDB = await this.usersService.findByEmail(user.email);

    if (!userFromDB) {
      throw new UnauthorizedException();
    }

    const newItem = this.itemRepository.create({
      item,
      itemDescription,
      aiDescription,
      prompt,
      title: item,
      bookmarked: false,
      user: userFromDB,
    });

    console.log('New item entity:', newItem);

    return this.itemRepository.save(newItem);
  }
}
