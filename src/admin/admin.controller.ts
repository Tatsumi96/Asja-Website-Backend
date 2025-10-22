import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AdminService } from './admin.service';

import { RoleGuard, Roles } from '@/auth/role.guard';
import { FastifyReply } from 'fastify';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles('Admin')
@Controller('admin')
export class AdminController {
  constructor(private service: AdminService) {}

  @Get()
  async callGetData(@Req() req: Request) {
    const userData = req.user as {
      sub: number;
    };
    return this.service.getData(userData.sub);
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'ENOENT') {
        throw new HttpException('Fichier non trouvé', HttpStatus.NOT_FOUND);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
