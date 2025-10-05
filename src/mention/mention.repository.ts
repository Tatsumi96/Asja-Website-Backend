import { Result } from '@/core/Result';
import { MentionDto } from './mention.dto';
import { UserEntity } from '@/mention/user.entity';

export abstract class MentionRepository {
  abstract getData(): Promise<Result<MentionDto>>;
  abstract register(user: UserEntity): Promise<Result<void>>;
}
