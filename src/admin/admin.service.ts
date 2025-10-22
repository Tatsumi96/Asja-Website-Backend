import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { FileRepository } from '@/file/file.repository';
import { fileReturnedType } from '@/file/file.repository.Impl';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(
    private studentRepository: AdminRepository,
    private fileRepository: FileRepository<fileReturnedType>,
  ) {}

  async getData(userId: number) {
    const result = await this.studentRepository.getData(userId);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async callGetFile(fileName: string) {
    const result = await this.fileRepository.get(fileName);
    if (result.status == 'failure') throw new ForbiddenException();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { mimeType: result.data.mimetype, stream: result.data.file };
  }
}
