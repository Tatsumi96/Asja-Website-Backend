import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Branche, Level, Mention } from '@/core/types';
import { UpdateDto } from './udpate.dto';
import { RoleGuard, Roles } from '@/auth/role.guard';

import { FastifyReply, FastifyRequest } from 'fastify';

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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles('Admin')
  @Put()
  async callUpdate(@Body() user: UpdateDto) {
    return this.service.update(user);
  }

  @Get('stream/:filename')
  async streamFile(
    @Param('filename') fileName: string,
    @Res() reply: FastifyReply,
  ) {
    try {
      const result = await this.service.callGetFile(fileName);
      reply.header('Content-Type', result.mimeType);
      reply.header('Content-Disposition', ` filename="${fileName}"`);
      reply.send(result.stream);
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error.code === 'ENOENT') {
        throw new HttpException('Fichier non trouvé', HttpStatus.NOT_FOUND);
      } else if (error.code === 'EACCES') {
        throw new HttpException(
          'Permissions insuffisantes pour lire le fichier',
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          'Erreur interne',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
