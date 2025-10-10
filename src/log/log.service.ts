import { BadRequestException, Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';

@Injectable()
export class LogService {
  constructor(private logRepo: LogRepository) {}

<<<<<<< HEAD
  async logs() {
    const result = await this.logRepo.read();
=======
  async logs(page: number, limit: number) {
    const result = await this.logRepo.read(page, limit);
>>>>>>> features/logs
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }
}
