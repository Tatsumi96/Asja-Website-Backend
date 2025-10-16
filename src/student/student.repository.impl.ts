import { failure, Result, success } from '@/core/Result';
import { StudentDto } from './student.dto';
import { StudentRepository } from './student.repository';
import { StudentPrismaService } from './student.prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateDto } from './udpate.dto';

@Injectable()
export class StudentRepositoryImpl implements StudentRepository {
  constructor(private service: StudentPrismaService) {}

  async getData(userId: number): Promise<Result<StudentDto>> {
    try {
      const result = await this.service.get(userId);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async update(user: UpdateDto): Promise<Result<void>> {
    try {
      await this.service.update(user);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
