import { Request, Response } from 'express';
import {
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiErrorResponse,
} from '@shared/application/dtos/api-response';

function getRequestId(req: Request): string {
  return (
    (req.headers['x-request-id'] as string) ||
    (req as Request & { requestId?: string }).requestId ||
    'unknown'
  );
}

function meta(req: Request) {
  return {
    timestamp: new Date().toISOString(),
    requestId: getRequestId(req),
  };
}

export class ApiResponder {
  static ok<T>(req: Request, res: Response, data: T, statusCode = 200): Response {
    const body: ApiSuccessResponse<T> = {
      success: true,
      data,
      meta: meta(req),
    };
    return res.status(statusCode).json(body);
  }

  static created<T>(req: Request, res: Response, data: T): Response {
    return ApiResponder.ok(req, res, data, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static paginated<T>(
    req: Request,
    res: Response,
    data: T[],
    pagination: { limit: number; count: number; nextCursor?: string },
  ): Response {
    const body: ApiPaginatedResponse<T> = {
      success: true,
      pagination,
      meta: meta(req),
      data,
    };
    return res.status(200).json(body);
  }

  static error(
    req: Request,
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, string[] | string>,
  ): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code, message, ...(details && { details }) },
      meta: meta(req),
    };
    return res.status(statusCode).json(body);
  }
}
