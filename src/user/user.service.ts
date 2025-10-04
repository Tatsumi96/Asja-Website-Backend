import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getData(userId: number) {
    const result = await this.userRepository.getData(userId);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }
}
