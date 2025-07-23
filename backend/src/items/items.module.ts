import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/items/item.entity';
import { ItemController } from 'src/items/items.controller';
import { ItemService } from 'src/items/providers/item.service';
import { OpenAIProvider } from 'src/items/providers/openai.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UsersModule],
  providers: [ItemService, OpenAIProvider],
  controllers: [ItemController],
  exports: [],
})
export class ItemsModule {}
