import { LoginDto, LoginReturnType } from '@/auth/login_Dto';
import { Result } from '@/core/Result';
import { UserEntity } from './user.entity';

export abstract class AuthRepository {
  abstract signIn(login: LoginDto): Promise<Result<LoginReturnType>>;

  abstract register(user: UserEntity): Promise<Result<void>>;
}
