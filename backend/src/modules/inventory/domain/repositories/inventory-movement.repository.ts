import { InventoryMovement } from '../entities/inventory-movement.entity';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';

export interface ListMovementsParams {
  limit: number;
  cursor?: string;
  productId?: string;
}

export interface InventoryMovementRepository {
  list(params: ListMovementsParams): Promise<PaginatedResult<InventoryMovement>>;
  save(movement: InventoryMovement): Promise<void>;
}
