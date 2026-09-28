import { asValue, asFunction, AwilixContainer, createContainer, InjectionMode } from 'awilix';
import { dynamoClient, TABLE_NAME } from '../dynamodb/dynamodb.client';
import { logger } from '../logging/winston.logger';
import { env } from '../config/env';

// Users
import { DynamoUserRepository } from '@modules/users/infrastructure/persistence/dynamo-user.repository';

// Auth
import { BcryptPasswordHasher } from '@modules/auth/infrastructure/bcrypt-hasher.service';
import { JwtTokenService } from '@modules/auth/infrastructure/jwt-token.service';
import { RegisterUseCase } from '@modules/auth/application/use-cases/register.use-case';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { AuthController } from '@modules/auth/presentation/auth.controller';

// Products
import { DynamoProductRepository } from '@modules/products/infrastructure/persistence/dynamo-product.repository';
import { ListProductsUseCase } from '@modules/products/application/use-cases/list-products.use-case';
import { GetProductUseCase } from '@modules/products/application/use-cases/get-product.use-case';
import { ProductsController } from '@modules/products/presentation/products.controller';
import { DynamoCartRepository } from '@/modules/carts/infrastructure/persistence/dynamo-cart.repository';
import { GetCartUseCase } from '@/modules/carts/application/use-cases/get-cart.use-case';
import { AddToCartUseCase } from '@/modules/carts/application/use-cases/add-to-cart.use-case';
import { RemoveFromCartUseCase } from '@/modules/carts/application/use-cases/remove-from-cart.use-case';
import { CartsController } from '@/modules/carts/presentation/carts.controller';
import { UpdateCartItemUseCase } from '@/modules/carts/application/use-cases/update-cart-item.use-case';
import { LoggerPort } from '@/shared/application/ports/logger.port';
import { EmailSenderPort } from '@/modules/orders/domain/ports/email-sender.port';
import { DynamoOrderRepository } from '@/modules/orders/infrastructure/persistence/dynamo-order.repository';
import { CheckoutUseCase } from '@/modules/orders/application/use-cases/checkout.use-case';
import { ListUserOrdersUseCase } from '@/modules/orders/application/use-cases/list-user-orders.use-case';
import { GetOrderUseCase } from '@/modules/orders/application/use-cases/get-order.use-case';
import { OrdersController } from '@/modules/orders/presentation/orders.controller';
import { WinstonLoggerAdapter } from '../logging/winston-logger.adapter';
import { NodemailerEmailService } from '@/modules/orders/infrastructure/notifications/nodemailer-email.service';

export interface AppContainer {
  // Compartido
  dynamoClient: typeof dynamoClient;
  tableName: string;
  logger: typeof logger;
  env: typeof env;

  // Users
  userRepository: DynamoUserRepository;

  // Auth
  passwordHasher: BcryptPasswordHasher;
  tokenService: JwtTokenService;
  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  authController: AuthController;

  // Products
  productRepository: DynamoProductRepository;
  listProductsUseCase: ListProductsUseCase;
  getProductUseCase: GetProductUseCase;
  productsController: ProductsController;

  //cart
  cartRepository: DynamoCartRepository;
  getCartUseCase: GetCartUseCase;
  addToCartUseCase: AddToCartUseCase;
  removeFromCartUseCase: RemoveFromCartUseCase;
  cartsController: CartsController;
  updateCartItemUseCase: UpdateCartItemUseCase;

  // Orders
  appLogger: LoggerPort;
  emailSender: EmailSenderPort;
  orderRepository: DynamoOrderRepository;
  checkoutUseCase: CheckoutUseCase;
  listUserOrdersUseCase: ListUserOrdersUseCase;
  getOrderUseCase: GetOrderUseCase;
  ordersController: OrdersController;
}

let container: AwilixContainer<AppContainer> | null = null;

export function buildContainer(): AwilixContainer<AppContainer> {
  if (container) return container;

  container = createContainer<AppContainer>({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });

  container.register({
    dynamoClient: asValue(dynamoClient),
    tableName: asValue(TABLE_NAME),
    logger: asValue(logger),
    env: asValue(env),

    // Users
    userRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoUserRepository(dynamoClient, tableName),
    ).singleton(),

    // Auth
    passwordHasher: asFunction(() => new BcryptPasswordHasher()).singleton(),
    tokenService: asFunction(
      ({ env }) => new JwtTokenService(env.JWT_SECRET, env.JWT_EXPIRES_IN),
    ).singleton(),
    registerUseCase: asFunction(
      ({ userRepository, passwordHasher, tokenService }) =>
        new RegisterUseCase(userRepository, passwordHasher, tokenService),
    ).singleton(),
    loginUseCase: asFunction(
      ({ userRepository, passwordHasher, tokenService }) =>
        new LoginUseCase(userRepository, passwordHasher, tokenService),
    ).singleton(),
    authController: asFunction(
      ({ registerUseCase, loginUseCase }) => new AuthController(registerUseCase, loginUseCase),
    ).singleton(),

    // Products
    productRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoProductRepository(dynamoClient, tableName),
    ).singleton(),
    listProductsUseCase: asFunction(
      ({ productRepository }) => new ListProductsUseCase(productRepository),
    ).singleton(),
    getProductUseCase: asFunction(
      ({ productRepository }) => new GetProductUseCase(productRepository),
    ).singleton(),
    productsController: asFunction(
      ({ listProductsUseCase, getProductUseCase }) =>
        new ProductsController(listProductsUseCase, getProductUseCase),
    ).singleton(),

    // Carts
    cartRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoCartRepository(dynamoClient, tableName),
    ).singleton(),
    getCartUseCase: asFunction(
      ({ cartRepository }) => new GetCartUseCase(cartRepository),
    ).singleton(),
    addToCartUseCase: asFunction(
      ({ cartRepository, productRepository }) =>
        new AddToCartUseCase(cartRepository, productRepository),
    ).singleton(),
    removeFromCartUseCase: asFunction(
      ({ cartRepository }) => new RemoveFromCartUseCase(cartRepository),
    ).singleton(),
    updateCartItemUseCase: asFunction(
      ({ cartRepository, productRepository }) =>
        new UpdateCartItemUseCase(cartRepository, productRepository),
    ).singleton(),
    cartsController: asFunction(
      ({ getCartUseCase, addToCartUseCase, removeFromCartUseCase, updateCartItemUseCase }) =>
        new CartsController(
          getCartUseCase,
          addToCartUseCase,
          removeFromCartUseCase,
          updateCartItemUseCase,
        ),
    ).singleton(),

    appLogger: asFunction(() => new WinstonLoggerAdapter()).singleton(),

    emailSender: asFunction(
      ({ env }) => new NodemailerEmailService(env.SMTP_HOST, env.SMTP_PORT, env.SMTP_FROM),
    ).singleton(),

    orderRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoOrderRepository(dynamoClient, tableName),
    ).singleton(),

    checkoutUseCase: asFunction(
      ({ orderRepository, cartRepository, productRepository, emailSender, appLogger }) =>
        new CheckoutUseCase(
          orderRepository,
          cartRepository,
          productRepository,
          emailSender,
          appLogger,
        ),
    ).singleton(),

    listUserOrdersUseCase: asFunction(
      ({ orderRepository }) => new ListUserOrdersUseCase(orderRepository),
    ).singleton(),

    getOrderUseCase: asFunction(
      ({ orderRepository }) => new GetOrderUseCase(orderRepository),
    ).singleton(),

    ordersController: asFunction(
      ({ checkoutUseCase, listUserOrdersUseCase, getOrderUseCase }) =>
        new OrdersController(checkoutUseCase, listUserOrdersUseCase, getOrderUseCase),
    ).singleton(),
  });

  return container;
}
