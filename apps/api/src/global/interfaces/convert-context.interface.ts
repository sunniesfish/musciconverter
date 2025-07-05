import { Request } from 'express';

export interface ExtendedRequest extends Request {
  api_accessToken?: string;
  currentUser?: any;
  apiDomain?: string;
}
