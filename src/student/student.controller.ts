import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Branche, Level, Mention } from '@/core/types';

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
}
