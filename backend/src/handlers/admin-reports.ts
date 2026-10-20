import serverless from 'serverless-http';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminReportsRouter } from '@modules/reports/presentation/reports.routes';
import { ReportsController } from '@modules/reports/presentation/reports.controller';
import { SalesReportUseCase } from '@modules/reports/application/use-cases/sales-report.use-case';
import { InventoryReportUseCase } from '@modules/reports/application/use-cases/inventory-report.use-case';
import { DynamoOrderRepository } from '@modules/orders/infrastructure/persistence/dynamo-order.repository';
import { DynamoProductRepository } from '@modules/products/infrastructure/persistence/dynamo-product.repository';
import { DynamoMovementRepository } from '@modules/inventory/infrastructure/persistence/dynamo-movement.repository';
import { dynamoClient, TABLE_NAME } from '@shared/infrastructure/dynamodb/dynamodb.client';

const orderRepository = new DynamoOrderRepository(dynamoClient, TABLE_NAME);
const productRepository = new DynamoProductRepository(dynamoClient, TABLE_NAME);
const movementRepository = new DynamoMovementRepository(dynamoClient, TABLE_NAME);

const salesReportUseCase = new SalesReportUseCase(orderRepository);
const inventoryReportUseCase = new InventoryReportUseCase(productRepository, movementRepository);

const controller = new ReportsController(salesReportUseCase, inventoryReportUseCase);

const router = buildAdminReportsRouter(controller);
const app = createExpressApp({ router, serviceName: 'admin-reports' });

export const handler = serverless(app);
