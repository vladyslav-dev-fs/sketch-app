// src/items/providers/item.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
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

    const userFromDB = await this.usersService.findByEmail(user.email);

    if (!userFromDB) {
      throw new UnauthorizedException();
    }

    // Check if user can make a request
    const canMakeRequest = await this.usersService.canMakeRequest(
      userFromDB.id,
    );
    if (!canMakeRequest) {
      throw new ForbiddenException(
        'Daily request limit exceeded. Upgrade to Pro for unlimited requests.',
      );
    }

    // Decrement user's requests (only for non-pro users)
    await this.usersService.decrementRequest(userFromDB.id);

    const prompt = `Generate a detailed description of the following product: ${item} - ${itemDescription}`;

    const aiDescription = await this.openAIService.generateDescription(prompt);

    const newItem = this.itemRepository.create({
      item,
      itemDescription,
      aiDescription,
      prompt,
      title: item,
      bookmarked: false,
      user: userFromDB,
    });

    return this.itemRepository.save(newItem);
  }

  async getAllItems(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async toggleBookmark(itemId: number, userId: number): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId, user: { id: userId } },
    });

    if (!item) {
      throw new UnauthorizedException('Item not found or access denied');
    }

    item.bookmarked = !item.bookmarked;
    return this.itemRepository.save(item);
  }
}
