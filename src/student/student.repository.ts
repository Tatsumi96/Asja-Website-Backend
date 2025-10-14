import { Result } from '@/core/Result';
import type { StudentDto } from './student.dto';

export abstract class StudentRepository {
  abstract getData(userId: number): Promise<Result<StudentDto>>;
}
