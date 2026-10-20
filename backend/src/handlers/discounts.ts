import serverless from 'serverless-http';
import { createExpressApp } from '@shared/infrastructure/http/express-app.factory';
import { buildDiscountsRouter } from '@modules/discounts/presentation/discounts.routes';
import { DiscountsController } from '@modules/discounts/presentation/discounts.controller';
import { DynamoDiscountRepository } from '@modules/discounts/infrastructure/persistence/dynamo-discount.repository';
import { CreateDiscountUseCase } from '@modules/discounts/application/use-cases/create-discount.use-case';
import { ListDiscountsUseCase } from '@modules/discounts/application/use-cases/list-discounts.use-case';
import { ValidateDiscountUseCase } from '@modules/discounts/application/use-cases/validate-discount.use-case';
import { ToggleDiscountUseCase } from '@modules/discounts/application/use-cases/toggle-discount.use-case';
import { dynamoClient, TABLE_NAME } from '@shared/infrastructure/dynamodb/dynamodb.client';

const discountRepository = new DynamoDiscountRepository(dynamoClient, TABLE_NAME);
const createDiscountUseCase = new CreateDiscountUseCase(discountRepository);
const listDiscountsUseCase = new ListDiscountsUseCase(discountRepository);
const validateDiscountUseCase = new ValidateDiscountUseCase(discountRepository);
const toggleDiscountUseCase = new ToggleDiscountUseCase(discountRepository);

const controller = new DiscountsController(
  createDiscountUseCase,
  listDiscountsUseCase,
  validateDiscountUseCase,
  toggleDiscountUseCase,
);

const router = buildDiscountsRouter(controller);
const app = createExpressApp({ router, serviceName: 'discounts' });

export const handler = serverless(app);
