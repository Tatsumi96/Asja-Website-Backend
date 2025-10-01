import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getData(userId: number) {
    const result = await this.userRepository.getData(userId);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async callRegister(user: UserEntity) {
    const hashPassword = await argon.hash(user.password);
    const userToInsert: UserEntity = { ...user, password: hashPassword };

    const result = await this.userRepository.register(userToInsert);

    if (result.status == 'failure') throw new BadRequestException();
    return { status: 'Success' };
  }
}
