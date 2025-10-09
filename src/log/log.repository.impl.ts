import { failure, Result, success } from '@/core/Result';

import { LogRepository } from './log.repository';
import { LogServiceFs } from './log.service.fs';

import { LogEntity } from './log.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogRepositoryImpl implements LogRepository {
  constructor(private service: LogServiceFs) {}

  async write(log: LogEntity): Promise<Result<void>> {
    try {
      await this.service.write(log);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async read(): Promise<Result<LogEntity[]>> {
    try {
      const logs = await this.service.read();
      return success(logs);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
