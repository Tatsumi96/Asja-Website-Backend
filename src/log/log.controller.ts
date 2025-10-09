import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller()
export class LogController {
  constructor(private service: LogService) {}

  @Get()
  async getLogs() {
    return this.service.logs();
  }
}
