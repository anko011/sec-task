import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const RefreshToken = createParamDecorator((_: unknown, context) => {
  const req: Request = context.switchToHttp().getRequest();
  return req.cookies['refreshToken'] ?? null;
});
