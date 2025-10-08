import { Result } from '@/core/Result';
import { MentionDto } from './mention.dto';
import { UserEntity } from '@/mention/user.entity';
import { UserDto } from './user.dto';

export abstract class MentionRepository {
  abstract getMentionData(): Promise<Result<MentionDto>>;
  abstract getStudentData(
    page: number,
    limit: number,
  ): Promise<Result<UserDto[]>>;
  abstract register(user: UserEntity): Promise<Result<void>>;

  abstract deleteStudent(id: string): Promise<Result<void>>;
}
