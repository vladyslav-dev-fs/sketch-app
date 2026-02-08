import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Request } from 'express';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { [REQUEST_USER_KEY]: ActiveUserData }>();
    const user = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);
