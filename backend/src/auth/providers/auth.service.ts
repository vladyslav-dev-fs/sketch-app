import { RefreshTokenDto } from 'src/auth/dtos/refresh-token.dto';
import { SignInProvider } from './sign-in.provider';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { RefreshTokensProvider } from 'src/auth/providers/refresh-tokens.provider';

import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvider: SignInProvider,

    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
