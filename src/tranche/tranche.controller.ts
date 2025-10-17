import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TrancheService } from './tranche.service';

import { TrancheDto } from './tranche.dto';
import { RoleGuard, Roles } from '@/auth/role.guard';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles('Admin')
@Controller('tranche')
export class TrancheController {
  constructor(private service: TrancheService) {}

  @HttpCode(HttpStatus.OK)
  @Put()
  async updateTranche(@Body() dto: TrancheDto) {
    console.log(dto);
    return this.service.updateTranche(dto);
  }
}
