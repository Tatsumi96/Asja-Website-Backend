import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async callGetData(@Req() req: Request) {
    return this.service.getData(req.user as number);
  }
}
