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
import { LogoutUseCase } from '@modules/auth/application/use-cases/logout.use-case';
import { AuthController } from '@modules/auth/presentation/auth.controller';
import { DynamoSessionRepository } from '@modules/auth/infrastructure/persistence/dynamo-session.repository';

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

// Admin Products
import { CreateProductUseCase } from '@modules/products/application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '@modules/products/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@modules/products/application/use-cases/delete-product.use-case';
import { GenerateProductUploadUrlUseCase } from '@modules/products/application/use-cases/generate-upload-url.use-case';
import { AdminProductsController } from '@modules/products/presentation/admin-products.controller';
import { s3Client, BUCKET_NAME } from '../s3/s3.client';

// Admin Users
import { ListUsersUseCase } from '@modules/users/application/use-cases/list-users.use-case';
import { CreateUserAdminUseCase } from '@modules/users/application/use-cases/create-user-admin.use-case';
import { UpdateUserAdminUseCase } from '@modules/users/application/use-cases/update-user-admin.use-case';
import { DeactivateUserUseCase } from '@modules/users/application/use-cases/deactivate-user.use-case';
import { AdminUsersController } from '@modules/users/presentation/admin-users.controller';

// Admin Orders
import { ListAllOrdersUseCase } from '@modules/orders/application/use-cases/list-all-orders.use-case';
import { UpdateOrderStatusUseCase } from '@modules/orders/application/use-cases/update-order-status.use-case';
import { AdminOrdersController } from '@modules/orders/presentation/admin-orders.controller';

// Roles
import { DynamoRoleRepository } from '@modules/roles/infrastructure/persistence/dynamo-role.repository';
import { ListRolesUseCase } from '@modules/roles/application/use-cases/list-roles.use-case';
import { GetRoleUseCase } from '@modules/roles/application/use-cases/get-role.use-case';
import { CreateRoleUseCase } from '@modules/roles/application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '@modules/roles/application/use-cases/update-role.use-case';
import { RolesController } from '@modules/roles/presentation/roles.controller';

// 7 days — sessions persist until explicit logout or TTL expiry in DynamoDB
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

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
  sessionRepository: DynamoSessionRepository;
  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
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

  // Admin Products
  createProductUseCase: CreateProductUseCase;
  updateProductUseCase: UpdateProductUseCase;
  deleteProductUseCase: DeleteProductUseCase;
  generateProductUploadUrlUseCase: GenerateProductUploadUrlUseCase;
  adminProductsController: AdminProductsController;

  // Admin Users
  listUsersUseCase: ListUsersUseCase;
  createUserAdminUseCase: CreateUserAdminUseCase;
  updateUserAdminUseCase: UpdateUserAdminUseCase;
  deactivateUserUseCase: DeactivateUserUseCase;
  adminUsersController: AdminUsersController;

  // Admin Orders
  listAllOrdersUseCase: ListAllOrdersUseCase;
  updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  adminOrdersController: AdminOrdersController;

  // Roles
  roleRepository: DynamoRoleRepository;
  listRolesUseCase: ListRolesUseCase;
  getRoleUseCase: GetRoleUseCase;
  createRoleUseCase: CreateRoleUseCase;
  updateRoleUseCase: UpdateRoleUseCase;
  rolesController: RolesController;
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
    sessionRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoSessionRepository(dynamoClient, tableName),
    ).singleton(),
    registerUseCase: asFunction(
      ({ userRepository, passwordHasher, tokenService, sessionRepository }) =>
        new RegisterUseCase(
          userRepository,
          passwordHasher,
          tokenService,
          sessionRepository,
          SESSION_DURATION_MS,
        ),
    ).singleton(),
    loginUseCase: asFunction(
      ({ userRepository, passwordHasher, tokenService, sessionRepository, roleRepository }) =>
        new LoginUseCase(
          userRepository,
          passwordHasher,
          tokenService,
          sessionRepository,
          roleRepository,
          SESSION_DURATION_MS,
        ),
    ).singleton(),
    logoutUseCase: asFunction(
      ({ sessionRepository }) => new LogoutUseCase(sessionRepository),
    ).singleton(),
    authController: asFunction(
      ({ registerUseCase, loginUseCase, logoutUseCase }) =>
        new AuthController(registerUseCase, loginUseCase, logoutUseCase),
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

    // Admin Products
    createProductUseCase: asFunction(
      ({ productRepository }) => new CreateProductUseCase(productRepository),
    ).singleton(),
    updateProductUseCase: asFunction(
      ({ productRepository }) => new UpdateProductUseCase(productRepository),
    ).singleton(),
    deleteProductUseCase: asFunction(
      ({ productRepository }) => new DeleteProductUseCase(productRepository),
    ).singleton(),
    generateProductUploadUrlUseCase: asFunction(
      ({ env }) => new GenerateProductUploadUrlUseCase(s3Client, BUCKET_NAME, env.S3_ENDPOINT),
    ).singleton(),
    adminProductsController: asFunction(
      ({
        listProductsUseCase,
        getProductUseCase,
        createProductUseCase,
        updateProductUseCase,
        deleteProductUseCase,
        generateProductUploadUrlUseCase,
      }) =>
        new AdminProductsController(
          listProductsUseCase,
          getProductUseCase,
          createProductUseCase,
          updateProductUseCase,
          deleteProductUseCase,
          generateProductUploadUrlUseCase,
        ),
    ).singleton(),

    // Admin Users
    listUsersUseCase: asFunction(
      ({ userRepository }) => new ListUsersUseCase(userRepository),
    ).singleton(),
    createUserAdminUseCase: asFunction(
      ({ userRepository, passwordHasher }) =>
        new CreateUserAdminUseCase(userRepository, passwordHasher),
    ).singleton(),
    updateUserAdminUseCase: asFunction(
      ({ userRepository, passwordHasher }) =>
        new UpdateUserAdminUseCase(userRepository, passwordHasher),
    ).singleton(),
    deactivateUserUseCase: asFunction(
      ({ userRepository }) => new DeactivateUserUseCase(userRepository),
    ).singleton(),
    adminUsersController: asFunction(
      ({
        listUsersUseCase,
        createUserAdminUseCase,
        updateUserAdminUseCase,
        deactivateUserUseCase,
      }) =>
        new AdminUsersController(
          listUsersUseCase,
          createUserAdminUseCase,
          updateUserAdminUseCase,
          deactivateUserUseCase,
        ),
    ).singleton(),

    // Admin Orders
    listAllOrdersUseCase: asFunction(
      ({ orderRepository }) => new ListAllOrdersUseCase(orderRepository),
    ).singleton(),
    updateOrderStatusUseCase: asFunction(
      ({ orderRepository }) => new UpdateOrderStatusUseCase(orderRepository),
    ).singleton(),
    adminOrdersController: asFunction(
      ({ listAllOrdersUseCase, updateOrderStatusUseCase }) =>
        new AdminOrdersController(listAllOrdersUseCase, updateOrderStatusUseCase),
    ).singleton(),

    // Roles
    roleRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoRoleRepository(dynamoClient, tableName),
    ).singleton(),
    listRolesUseCase: asFunction(
      ({ roleRepository }) => new ListRolesUseCase(roleRepository),
    ).singleton(),
    getRoleUseCase: asFunction(
      ({ roleRepository }) => new GetRoleUseCase(roleRepository),
    ).singleton(),
    createRoleUseCase: asFunction(
      ({ roleRepository }) => new CreateRoleUseCase(roleRepository),
    ).singleton(),
    updateRoleUseCase: asFunction(
      ({ roleRepository }) => new UpdateRoleUseCase(roleRepository),
    ).singleton(),
    rolesController: asFunction(
      ({ listRolesUseCase, getRoleUseCase, createRoleUseCase, updateRoleUseCase }) =>
        new RolesController(listRolesUseCase, getRoleUseCase, createRoleUseCase, updateRoleUseCase),
    ).singleton(),
  });

  return container;
}
