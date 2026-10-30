import serverless from 'serverless-http';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildAdminReportsRouter } from '@modules/reports/presentation/reports.routes';
import { ReportsController } from '@modules/reports/presentation/reports.controller';
import { SalesReportUseCase } from '@modules/reports/application/use-cases/sales-report.use-case';
import { InventoryReportUseCase } from '@modules/reports/application/use-cases/inventory-report.use-case';
import { PurchasesReportUseCase } from '@modules/reports/application/use-cases/purchases-report.use-case';
import { ClientAnalyticsReportUseCase } from '@modules/reports/application/use-cases/client-analytics-report.use-case';
import { DynamoOrderRepository } from '@modules/orders/infrastructure/persistence/dynamo-order.repository';
import { DynamoProductRepository } from '@modules/products/infrastructure/persistence/dynamo-product.repository';
import { DynamoMovementRepository } from '@modules/inventory/infrastructure/persistence/dynamo-movement.repository';
import { DynamoPurchaseRepository } from '@modules/purchases/infrastructure/persistence/dynamo-purchase.repository';
import { DynamoUserRepository } from '@modules/users/infrastructure/persistence/dynamo-user.repository';
import { dynamoClient, TABLE_NAME } from '@shared/infrastructure/dynamodb/dynamodb.client';

const orderRepository = new DynamoOrderRepository(dynamoClient, TABLE_NAME);
const productRepository = new DynamoProductRepository(dynamoClient, TABLE_NAME);
const movementRepository = new DynamoMovementRepository(dynamoClient, TABLE_NAME);
const purchaseRepository = new DynamoPurchaseRepository(dynamoClient, TABLE_NAME);
const userRepository = new DynamoUserRepository(dynamoClient, TABLE_NAME);

const salesReportUseCase = new SalesReportUseCase(orderRepository);
const inventoryReportUseCase = new InventoryReportUseCase(productRepository, movementRepository);
const purchasesReportUseCase = new PurchasesReportUseCase(purchaseRepository);
const clientAnalyticsUseCase = new ClientAnalyticsReportUseCase(userRepository, orderRepository);

const controller = new ReportsController(
  salesReportUseCase,
  inventoryReportUseCase,
  purchasesReportUseCase,
  clientAnalyticsUseCase,
);

const router = buildAdminReportsRouter(controller);
const app = createExpressApp({ router, serviceName: 'admin-reports' });

export const handler = serverless(app);
