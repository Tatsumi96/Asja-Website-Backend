import { Result } from '@/core/Result';
import { AdminDto } from './admin.dto';

export abstract class AdminRepository {
  abstract getData(adminId: number): Promise<Result<AdminDto>>;
}
