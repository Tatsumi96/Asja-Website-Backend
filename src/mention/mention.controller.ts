import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MentionService } from './mention.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './user.entity';

@Controller('mention')
export class MentionController {
  constructor(private service: MentionService) {}

  // @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get()
  async callMentionData() {
    return this.service.getMentionData();
  }

  // @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get('student')
  async callStudentData(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.getStudentData(page, limit);
  }

  @Post('register')
  async callRegister(@Body() user: UserEntity) {
    return this.service.callRegister(user);
  }
}
