// src/users/users.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/providers/users.service';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Current active user without password',
  })
  async getActiveUser(
    @ActiveUser('sub') sub: number,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.getActiveUser(sub);
  }

  @Auth(AuthType.None)
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
