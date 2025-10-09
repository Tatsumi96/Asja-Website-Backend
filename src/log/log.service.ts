import { BadRequestException, Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(private logRepo: LogRepository) {}

  async logs() {
    const result = await this.logRepo.read();
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }
}
