import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { MentionRepository } from './mention.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class MentionService {
  constructor(private mentionRepository: MentionRepository) {}

  async getData() {
    const result = await this.mentionRepository.getData();
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
