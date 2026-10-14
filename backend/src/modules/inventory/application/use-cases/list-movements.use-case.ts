import { InventoryMovementRepository, ListMovementsParams } from '@modules/inventory/domain/repositories/inventory-movement.repository';
import { PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { InventoryMovementProps } from '@modules/inventory/domain/entities/inventory-movement.entity';

export class ListMovementsUseCase {
  constructor(private readonly movementRepo: InventoryMovementRepository) {}

  async execute(params: ListMovementsParams): Promise<PaginatedResult<InventoryMovementProps>> {
    const result = await this.movementRepo.list(params);
    return {
      items: result.items.map((m) => m.toJSON()),
      count: result.count,
      nextCursor: result.nextCursor,
    };
  }
}
