import serverless from 'serverless-http';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminAuditRouter } from '@modules/audit/presentation/audit.routes';
import { AuditController } from '@modules/audit/presentation/audit.controller';
import { DynamoAuditLogRepository } from '@modules/audit/infrastructure/persistence/dynamo-audit-log.repository';
import { ListAuditLogsUseCase } from '@modules/audit/application/use-cases/list-audit-logs.use-case';
import { dynamoClient, TABLE_NAME } from '@shared/infrastructure/dynamodb/dynamodb.client';

const auditLogRepository = new DynamoAuditLogRepository(dynamoClient, TABLE_NAME);
const listAuditLogsUseCase = new ListAuditLogsUseCase(auditLogRepository);

const controller = new AuditController(listAuditLogsUseCase);

const router = buildAdminAuditRouter(controller);
const app = createExpressApp({ router, serviceName: 'admin-audit' });

export const handler = serverless(app);
