import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { MentionRepository } from './mention.repository';
import { UserEntity } from './user.entity';
import { FileRepository } from './fileRepository';
import { fileReturnedType } from './file_repositoryImpl';

@Injectable()
export class MentionService {
  constructor(
    private mentionRepository: MentionRepository,
    private fileRepository: FileRepository<fileReturnedType>,
  ) {}

  async getMentionData() {
    const result = await this.mentionRepository.getMentionData();
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async getStudentData(page: number, limit: number) {
    const result = await this.mentionRepository.getStudentData(page, limit);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async callRegister(user: UserEntity) {
    const hashPassword = await argon.hash(user.password);
    const userToInsert: UserEntity = { ...user, password: hashPassword };

    const result = await this.mentionRepository.register(userToInsert);

    if (result.status == 'failure') throw new BadRequestException();
    return { status: 'Success' };
  }

  async callGetFile(fileName: string) {
    const result = await this.fileRepository.get(fileName);
    if (result.status == 'failure') throw new ForbiddenException();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { mimeType: result.data.mimetype, stream: result.data.file };
  }

  async deleteStudent(id: string) {
    const result = await this.mentionRepository.deleteStudent(id);
    if (result.status == 'failure') throw new ForbiddenException();
  }
}
