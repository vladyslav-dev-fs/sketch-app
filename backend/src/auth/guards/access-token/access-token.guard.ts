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
    const requiredAuthTypes = this.reflector.get<AuthType[]>(
      AUTH_TYPE_KEY,
      context.getHandler(),
    );

    if (requiredAuthTypes && requiredAuthTypes.includes(AuthType.None)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeaderOrCookie(request);

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }

  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    const match = cookieHeader.match(/jwt=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : undefined;
  }
}
