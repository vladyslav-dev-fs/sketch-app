// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/providers/users.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: User,
    description: 'User created successfuly',
  })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
