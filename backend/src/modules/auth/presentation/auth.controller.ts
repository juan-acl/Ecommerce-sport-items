import { Response, NextFunction } from 'express';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { RegisterDto } from '@modules/auth/application/dtos/register.dto';
import { LoginDto } from '@modules/auth/application/dtos/login.dto';
import { ApiResponder } from '@shared/infrastructure/http/response.builder';
import { AuthenticatedRequest } from '@shared/infrastructure/http/middlewares/auth.middleware';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  register = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body as RegisterDto, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      ApiResponder.created(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body as LoginDto, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      ApiResponder.ok(req, res, result);
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.sessionId) {
        await this.logoutUseCase.execute(req.sessionId);
      }
      ApiResponder.noContent(res);
    } catch (err) {
      next(err);
    }
  };
}
