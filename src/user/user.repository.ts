import { Result } from '@/core/Result';
import type { UserDto } from './user.dto';

export abstract class UserRepository {
  abstract getData(userId: number): Promise<Result<UserDto>>;
}
