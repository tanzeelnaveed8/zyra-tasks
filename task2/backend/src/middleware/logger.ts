import morgan, { TokenIndexer } from 'morgan';
import { Request, Response } from 'express';

morgan.token('request-id', (req: Request) => req.requestId ?? '-');

export const logger = morgan(
  (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) =>
    [
      `[${tokens['request-id'](req, res)}]`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      `${tokens['response-time'](req, res)}ms`,
    ].join(' ')
);
