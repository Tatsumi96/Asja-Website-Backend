import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { TrancheService } from './tranche.service';

import { TrancheDto } from './tranche.dto';
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
