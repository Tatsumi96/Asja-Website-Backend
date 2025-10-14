import { LoginDto, LoginReturnType } from '@/auth/login.dto';
import { Result } from '@/core/Result';

export abstract class AuthRepository {
  abstract signIn(login: LoginDto): Promise<Result<LoginReturnType>>;
}
