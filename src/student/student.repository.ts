import { Result } from '@/core/Result';
import type { StudentDto } from './student.dto';
import { UpdateDto } from './udpate.dto';

export abstract class StudentRepository {
  abstract getData(userId: number): Promise<Result<StudentDto>>;
  abstract update(user: UpdateDto): Promise<Result<void>>;
}
