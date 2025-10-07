import { Result } from '@/core/Result';
import { TrancheDto } from './tranche.dto';

export abstract class TrancheRepository {
  abstract update(dto: TrancheDto): Promise<Result<void>>;
}
