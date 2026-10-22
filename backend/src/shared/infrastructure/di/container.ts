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
import { GetMeUseCase } from '@modules/auth/application/use-cases/get-me.use-case';
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
import { GetUserByIdUseCase } from '@modules/users/application/use-cases/get-user-by-id.use-case';
import { CreateUserAdminUseCase } from '@modules/users/application/use-cases/create-user-admin.use-case';
import { UpdateUserAdminUseCase } from '@modules/users/application/use-cases/update-user-admin.use-case';
import { DeactivateUserUseCase } from '@modules/users/application/use-cases/deactivate-user.use-case';
import { AdminUsersController } from '@modules/users/presentation/admin-users.controller';

// Admin Orders
import { ListAllOrdersUseCase } from '@modules/orders/application/use-cases/list-all-orders.use-case';
import { UpdateOrderStatusUseCase } from '@modules/orders/application/use-cases/update-order-status.use-case';
import { ApproveOrderUseCase } from '@modules/orders/application/use-cases/approve-order.use-case';
import { AdminOrdersController } from '@modules/orders/presentation/admin-orders.controller';

// Discounts
import { DynamoDiscountRepository } from '@modules/discounts/infrastructure/persistence/dynamo-discount.repository';

// Suppliers
import { DynamoSupplierRepository } from '@modules/suppliers/infrastructure/persistence/dynamo-supplier.repository';
import { ListSuppliersUseCase } from '@modules/suppliers/application/use-cases/list-suppliers.use-case';
import { GetSupplierUseCase } from '@modules/suppliers/application/use-cases/get-supplier.use-case';
import { CreateSupplierUseCase } from '@modules/suppliers/application/use-cases/create-supplier.use-case';
import { UpdateSupplierUseCase } from '@modules/suppliers/application/use-cases/update-supplier.use-case';
import { DeleteSupplierUseCase } from '@modules/suppliers/application/use-cases/delete-supplier.use-case';
import { SuppliersController } from '@modules/suppliers/presentation/suppliers.controller';

// Inventory
import { DynamoMovementRepository } from '@modules/inventory/infrastructure/persistence/dynamo-movement.repository';
import { ListMovementsUseCase } from '@modules/inventory/application/use-cases/list-movements.use-case';
import { GetLowStockUseCase } from '@modules/inventory/application/use-cases/get-low-stock.use-case';
import { InventoryController } from '@modules/inventory/presentation/inventory.controller';

// Purchases
import { DynamoPurchaseRepository } from '@modules/purchases/infrastructure/persistence/dynamo-purchase.repository';
import { ListPurchasesUseCase } from '@modules/purchases/application/use-cases/list-purchases.use-case';
import { GetPurchaseUseCase } from '@modules/purchases/application/use-cases/get-purchase.use-case';
import { CreatePurchaseUseCase } from '@modules/purchases/application/use-cases/create-purchase.use-case';
import { ReceivePurchaseUseCase } from '@modules/purchases/application/use-cases/receive-purchase.use-case';
import { PartialReceivePurchaseUseCase } from '@modules/purchases/application/use-cases/partial-receive-purchase.use-case';
import { CancelPurchaseUseCase } from '@modules/purchases/application/use-cases/cancel-purchase.use-case';
import { PurchasesController } from '@modules/purchases/presentation/purchases.controller';

// Roles
import { DynamoRoleRepository } from '@modules/roles/infrastructure/persistence/dynamo-role.repository';
import { ListRolesUseCase } from '@modules/roles/application/use-cases/list-roles.use-case';
import { GetRoleUseCase } from '@modules/roles/application/use-cases/get-role.use-case';
import { CreateRoleUseCase } from '@modules/roles/application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '@modules/roles/application/use-cases/update-role.use-case';
import { RolesController } from '@modules/roles/presentation/roles.controller';

// Audit
import { DynamoAuditLogRepository } from '@modules/audit/infrastructure/persistence/dynamo-audit-log.repository';
import { CreateAuditLogUseCase } from '@modules/audit/application/use-cases/create-audit-log.use-case';
import { ListAuditLogsUseCase } from '@modules/audit/application/use-cases/list-audit-logs.use-case';

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
  getMeUseCase: GetMeUseCase;
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
  getUserByIdUseCase: GetUserByIdUseCase;
  createUserAdminUseCase: CreateUserAdminUseCase;
  updateUserAdminUseCase: UpdateUserAdminUseCase;
  deactivateUserUseCase: DeactivateUserUseCase;
  adminUsersController: AdminUsersController;

  // Admin Orders
  listAllOrdersUseCase: ListAllOrdersUseCase;
  updateOrderStatusUseCase: UpdateOrderStatusUseCase;
  approveOrderUseCase: ApproveOrderUseCase;
  adminOrdersController: AdminOrdersController;

  // Discounts
  discountRepository: DynamoDiscountRepository;

  // Suppliers
  supplierRepository: DynamoSupplierRepository;
  listSuppliersUseCase: ListSuppliersUseCase;
  getSupplierUseCase: GetSupplierUseCase;
  createSupplierUseCase: CreateSupplierUseCase;
  updateSupplierUseCase: UpdateSupplierUseCase;
  deleteSupplierUseCase: DeleteSupplierUseCase;
  suppliersController: SuppliersController;

  // Inventory
  movementRepository: DynamoMovementRepository;
  listMovementsUseCase: ListMovementsUseCase;
  getLowStockUseCase: GetLowStockUseCase;
  inventoryController: InventoryController;

  // Purchases
  purchaseRepository: DynamoPurchaseRepository;
  listPurchasesUseCase: ListPurchasesUseCase;
  getPurchaseUseCase: GetPurchaseUseCase;
  createPurchaseUseCase: CreatePurchaseUseCase;
  receivePurchaseUseCase: ReceivePurchaseUseCase;
  partialReceivePurchaseUseCase: PartialReceivePurchaseUseCase;
  cancelPurchaseUseCase: CancelPurchaseUseCase;
  purchasesController: PurchasesController;

  // Roles
  roleRepository: DynamoRoleRepository;
  listRolesUseCase: ListRolesUseCase;
  getRoleUseCase: GetRoleUseCase;
  createRoleUseCase: CreateRoleUseCase;
  updateRoleUseCase: UpdateRoleUseCase;
  rolesController: RolesController;

  // Audit
  auditLogRepository: DynamoAuditLogRepository;
  createAuditLogUseCase: CreateAuditLogUseCase;
  listAuditLogsUseCase: ListAuditLogsUseCase;
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
    getMeUseCase: asFunction(
      ({ userRepository, roleRepository }) => new GetMeUseCase(userRepository, roleRepository),
    ).singleton(),
    authController: asFunction(
      ({ registerUseCase, loginUseCase, logoutUseCase, getMeUseCase }) =>
        new AuthController(registerUseCase, loginUseCase, logoutUseCase, getMeUseCase),
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

    // Discounts (needed by checkout)
    discountRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoDiscountRepository(dynamoClient, tableName),
    ).singleton(),

    checkoutUseCase: asFunction(
      ({ orderRepository, cartRepository, productRepository, emailSender, appLogger, movementRepository, discountRepository }) =>
        new CheckoutUseCase(
          orderRepository,
          cartRepository,
          productRepository,
          emailSender,
          appLogger,
          movementRepository,
          discountRepository,
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
        createAuditLogUseCase,
      }) =>
        new AdminProductsController(
          listProductsUseCase,
          getProductUseCase,
          createProductUseCase,
          updateProductUseCase,
          deleteProductUseCase,
          generateProductUploadUrlUseCase,
          createAuditLogUseCase,
        ),
    ).singleton(),

    // Admin Users
    listUsersUseCase: asFunction(
      ({ userRepository }) => new ListUsersUseCase(userRepository),
    ).singleton(),
    getUserByIdUseCase: asFunction(
      ({ userRepository }) => new GetUserByIdUseCase(userRepository),
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
        getUserByIdUseCase,
        createUserAdminUseCase,
        updateUserAdminUseCase,
        deactivateUserUseCase,
        createAuditLogUseCase,
      }) =>
        new AdminUsersController(
          listUsersUseCase,
          getUserByIdUseCase,
          createUserAdminUseCase,
          updateUserAdminUseCase,
          deactivateUserUseCase,
          createAuditLogUseCase,
        ),
    ).singleton(),

    // Admin Orders
    listAllOrdersUseCase: asFunction(
      ({ orderRepository }) => new ListAllOrdersUseCase(orderRepository),
    ).singleton(),
    updateOrderStatusUseCase: asFunction(
      ({ orderRepository, productRepository, movementRepository, emailSender, userRepository }) =>
        new UpdateOrderStatusUseCase(orderRepository, productRepository, movementRepository, emailSender, userRepository),
    ).singleton(),
    approveOrderUseCase: asFunction(
      ({ orderRepository, productRepository, movementRepository }) =>
        new ApproveOrderUseCase(orderRepository, productRepository, movementRepository),
    ).singleton(),
    adminOrdersController: asFunction(
      ({ listAllOrdersUseCase, updateOrderStatusUseCase, approveOrderUseCase, getOrderUseCase, createAuditLogUseCase }) =>
        new AdminOrdersController(listAllOrdersUseCase, updateOrderStatusUseCase, approveOrderUseCase, getOrderUseCase, createAuditLogUseCase),
    ).singleton(),

    // Suppliers
    supplierRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoSupplierRepository(dynamoClient, tableName),
    ).singleton(),
    listSuppliersUseCase: asFunction(
      ({ supplierRepository }) => new ListSuppliersUseCase(supplierRepository),
    ).singleton(),
    getSupplierUseCase: asFunction(
      ({ supplierRepository }) => new GetSupplierUseCase(supplierRepository),
    ).singleton(),
    createSupplierUseCase: asFunction(
      ({ supplierRepository }) => new CreateSupplierUseCase(supplierRepository),
    ).singleton(),
    updateSupplierUseCase: asFunction(
      ({ supplierRepository }) => new UpdateSupplierUseCase(supplierRepository),
    ).singleton(),
    deleteSupplierUseCase: asFunction(
      ({ supplierRepository }) => new DeleteSupplierUseCase(supplierRepository),
    ).singleton(),
    suppliersController: asFunction(
      ({ listSuppliersUseCase, getSupplierUseCase, createSupplierUseCase, updateSupplierUseCase, deleteSupplierUseCase }) =>
        new SuppliersController(
          listSuppliersUseCase,
          getSupplierUseCase,
          createSupplierUseCase,
          updateSupplierUseCase,
          deleteSupplierUseCase,
        ),
    ).singleton(),

    // Inventory
    movementRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoMovementRepository(dynamoClient, tableName),
    ).singleton(),
    listMovementsUseCase: asFunction(
      ({ movementRepository }) => new ListMovementsUseCase(movementRepository),
    ).singleton(),
    getLowStockUseCase: asFunction(
      ({ productRepository, purchaseRepository, movementRepository }) =>
        new GetLowStockUseCase(productRepository, purchaseRepository, movementRepository),
    ).singleton(),
    inventoryController: asFunction(
      ({ listMovementsUseCase, getLowStockUseCase }) =>
        new InventoryController(listMovementsUseCase, getLowStockUseCase),
    ).singleton(),

    // Purchases
    purchaseRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoPurchaseRepository(dynamoClient, tableName),
    ).singleton(),
    listPurchasesUseCase: asFunction(
      ({ purchaseRepository }) => new ListPurchasesUseCase(purchaseRepository),
    ).singleton(),
    getPurchaseUseCase: asFunction(
      ({ purchaseRepository }) => new GetPurchaseUseCase(purchaseRepository),
    ).singleton(),
    createPurchaseUseCase: asFunction(
      ({ purchaseRepository, supplierRepository }) =>
        new CreatePurchaseUseCase(purchaseRepository, supplierRepository),
    ).singleton(),
    receivePurchaseUseCase: asFunction(
      ({ purchaseRepository, productRepository, movementRepository }) =>
        new ReceivePurchaseUseCase(purchaseRepository, productRepository, movementRepository),
    ).singleton(),
    cancelPurchaseUseCase: asFunction(
      ({ purchaseRepository, productRepository, movementRepository }) =>
        new CancelPurchaseUseCase(purchaseRepository, productRepository, movementRepository),
    ).singleton(),
    partialReceivePurchaseUseCase: asFunction(
      ({ purchaseRepository, productRepository, movementRepository }) =>
        new PartialReceivePurchaseUseCase(purchaseRepository, productRepository, movementRepository),
    ).singleton(),
    purchasesController: asFunction(
      ({ listPurchasesUseCase, getPurchaseUseCase, createPurchaseUseCase, receivePurchaseUseCase, cancelPurchaseUseCase, partialReceivePurchaseUseCase }) =>
        new PurchasesController(
          listPurchasesUseCase,
          getPurchaseUseCase,
          createPurchaseUseCase,
          receivePurchaseUseCase,
          cancelPurchaseUseCase,
          partialReceivePurchaseUseCase,
        ),
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

    // Audit
    auditLogRepository: asFunction(
      ({ dynamoClient, tableName }) => new DynamoAuditLogRepository(dynamoClient, tableName),
    ).singleton(),
    createAuditLogUseCase: asFunction(
      ({ auditLogRepository }) => new CreateAuditLogUseCase(auditLogRepository),
    ).singleton(),
    listAuditLogsUseCase: asFunction(
      ({ auditLogRepository }) => new ListAuditLogsUseCase(auditLogRepository),
    ).singleton(),
  });

  return container;
}
