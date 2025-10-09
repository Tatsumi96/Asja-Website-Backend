import { Global, Module } from '@nestjs/common';

import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';
import { LogRepositoryImpl } from './log.repository.impl';
import { LogServiceFs, LogServiceFsImpl } from './log.service.fs';

@Global()
@Module({
  controllers: [LogController],
  exports: [LogRepository],
  providers: [
    LogService,
    { provide: LogRepository, useClass: LogRepositoryImpl },
    { provide: LogServiceFs, useClass: LogServiceFsImpl },
  ],
})
export class LogModule {}
