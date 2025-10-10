<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller()
=======
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('logs')
>>>>>>> features/logs
export class LogController {
  constructor(private service: LogService) {}

  @Get()
<<<<<<< HEAD
  async getLogs() {
    return this.service.logs();
=======
  async getLogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.logs(page, limit);
>>>>>>> features/logs
  }
}
