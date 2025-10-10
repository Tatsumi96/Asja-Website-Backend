import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('logs')
export class LogController {
  constructor(private service: LogService) {}

  @Get()
  async getLogs(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.logs(page, limit);
  }
}
