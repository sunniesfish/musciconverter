import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ApiAccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.api_accessToken;
  },
);
