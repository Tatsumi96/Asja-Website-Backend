import { BadRequestException, Injectable } from '@nestjs/common';

import { StudentRepository } from './student.repository';
import { UpdateDto } from './udpate.dto';

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  async getData(userId: number) {
    const result = await this.studentRepository.getData(userId);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async update(user: UpdateDto) {
    const result = await this.studentRepository.update(user);
    if (result.status == 'failure') throw new BadRequestException();
  }
}
