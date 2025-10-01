import { Result } from '@/core/Result';
import type { UserDto } from './user.dto';
import { UserEntity } from './user.entity';

export abstract class UserRepository {
  abstract getData(userId: number): Promise<Result<UserDto>>;
  abstract register(user: UserEntity): Promise<Result<void>>;
}
