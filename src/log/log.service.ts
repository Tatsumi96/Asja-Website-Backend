import { BadRequestException, Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(private logRepo: LogRepository) {}

  async logs(page: number, limit: number) {
    const result = await this.logRepo.read(page, limit);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }
}
