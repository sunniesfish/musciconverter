import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseTransformMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const originalJson = res.json;

    res.json = function (data: any) {
      const transformedData = {
        success: res.statusCode < 400,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
        data: data,
      };
      return originalJson.call(this, transformedData);
    };

    res.send = function (data: any) {
      if (typeof data === 'object' && data !== null) {
        const transformedData = {
          success: res.statusCode < 400,
          statusCode: res.statusCode,
          timestamp: new Date().toISOString(),
          data: data,
        };
        return originalSend.call(this, transformedData);
      }
      return originalSend.call(this, data);
    };

    next();
  }
}
