import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Branche, Level, Mention } from '@/core/types';
import { UpdateDto } from './udpate.dto';

@Controller('student')
export class StudentController {
  constructor(private service: StudentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async callGetData(@Req() req: Request) {
    const userData = req.user as {
      sub: number;
      mention: Mention;
      level: Level;
      branche: Branche;
    };
    return this.service.getData(userData.sub);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async callUpdate(@Body() user: UpdateDto) {
    return this.service.update(user);
  }
}
