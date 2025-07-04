import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      return await this.usersRepository.save(user);
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
