import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LogService } from './log.service';
import { RoleGuard, Roles } from '@/auth/role.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles('Admin')
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
