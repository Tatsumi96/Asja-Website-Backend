import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { MentionRepository } from './mention.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class MentionService {
  constructor(private mentionRepository: MentionRepository) {}

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
}
