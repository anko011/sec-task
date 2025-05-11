import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator((_: unknown, context) => {
  const req: Request = context.switchToHttp().getRequest();
  return req.headers['user-agent'] ?? null;
});
