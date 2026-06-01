import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[${req.requestId}] Unhandled error: ${err.message}`, err.stack);
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.requestId,
  });
}
