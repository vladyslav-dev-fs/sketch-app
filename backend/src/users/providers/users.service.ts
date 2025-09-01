import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  public async create(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
      requests: 5,
      proPlan: false,
      lastRequestReset: new Date(),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the the datbase',
        },
      );
    }

    return newUser;
  }

  async getActiveUser(sub: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id: sub },
      relations: ['items'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.checkAndResetDailyRequests(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async canMakeRequest(userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.proPlan) {
      return true;
    }

    await this.checkAndResetDailyRequests(user);

    return user.requests > 0;
  }

  async decrementRequest(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.proPlan) {
      return;
    }

    await this.checkAndResetDailyRequests(user);

    if (user.requests <= 0) {
      throw new ForbiddenException(
        'Daily request limit exceeded. Upgrade to Pro for unlimited requests.',
      );
    }

    await this.usersRepository.update(userId, {
      requests: user.requests - 1,
    });
  }

  private async checkAndResetDailyRequests(user: User): Promise<void> {
    const now = new Date();
    const kyivTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Europe/Kiev' }),
    );
    const lastResetKyiv = new Date(
      user.lastRequestReset.toLocaleString('en-US', {
        timeZone: 'Europe/Kiev',
      }),
    );

    const isNewDay = kyivTime.toDateString() !== lastResetKyiv.toDateString();

    if (isNewDay && !user.proPlan) {
      await this.usersRepository.update(user.id, {
        requests: 5,
        lastRequestReset: now,
      });
      user.requests = 5;
      user.lastRequestReset = now;
    }
  }

  @Cron('0 0 * * *', {
    timeZone: 'Europe/Kiev',
  })
  async resetAllDailyRequests(): Promise<void> {
    await this.usersRepository.update(
      { proPlan: false },
      {
        requests: 5,
        lastRequestReset: new Date(),
      },
    );
    console.log('Daily requests reset for all non-pro users');
  }

  async upgradeToProPlan(
    userId: number,
    stripeCustomerId: string,
  ): Promise<void> {
    await this.usersRepository.update(userId, {
      proPlan: true,
      stripeCustomerId,
    });
  }
}
