import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MentionService } from './mention.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './user.entity';

@Controller('mention')
export class MentionController {
  constructor(private service: MentionService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async callGetData() {
    return this.service.getData();
  }

  @Post('register')
  async callRegister(@Body() user: UserEntity) {
    return this.service.callRegister(user);
  }
}
