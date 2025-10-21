import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { StudentRepository } from './student.repository';
import { UpdateDto } from './udpate.dto';
import { FileRepository } from '@/file/file.repository';
import { fileReturnedType } from '@/file/file.repository.Impl';

@Injectable()
export class StudentService {
  constructor(
    private studentRepository: StudentRepository,
    private fileRepository: FileRepository<fileReturnedType>,
  ) {}

  async getData(userId: number) {
    const result = await this.studentRepository.getData(userId);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async update(user: UpdateDto) {
    const result = await this.studentRepository.update(user);
    if (result.status == 'failure') throw new BadRequestException();
  }

  async callGetFile(fileName: string) {
    const result = await this.fileRepository.get(fileName);
    if (result.status == 'failure') throw new ForbiddenException();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { mimeType: result.data.mimetype, stream: result.data.file };
  }
}
