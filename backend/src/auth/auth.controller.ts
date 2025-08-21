import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import { AuthService } from './providers/auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    /*
     * Injecting Auth Service
     */
    private readonly authService: AuthService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: false, // Встанови true на проді (при HTTPS)
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 хв
    });

    // Зберігаємо refreshToken в cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    return { message: 'Login successful' };
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK) // changed since the default is 201
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Get('validate')
  validate() {
    return { valid: true };
  }

  // Add this method to your AuthController (backend/src/auth/auth.controller.ts)

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public logout(@Res({ passthrough: true }) res: Response) {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Set expiration to past date
    });

    // Clear the refresh token cookie
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Set expiration to past date
    });

    return { message: 'Logout successful' };
  }
}
