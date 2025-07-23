import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import jwtConfig from 'src/auth/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { AUTH_TYPE_KEY } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

interface JwtPayload {
  sub: number;
  email: string;
  authType?: AuthType;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  [REQUEST_USER_KEY]: JwtPayload;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Отримуємо authTypes з декоратора @Auth()
    const requiredAuthTypes = this.reflector.get<AuthType[]>(
      AUTH_TYPE_KEY,
      context.getHandler(),
    );

    // Якщо явно вказано AuthType.None — робимо маршрут публічним (без перевірки токена)
    if (requiredAuthTypes && requiredAuthTypes.includes(AuthType.None)) {
      return true;
    }

    // Інакше — перевіряємо JWT
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [, token] = authHeader.split(' ');
    return token;
  }
}
