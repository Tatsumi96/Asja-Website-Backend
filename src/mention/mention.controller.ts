import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MentionService } from './mention.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './user.entity';

import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyUploadInterceptor } from './fastifyInterceptor';
import { RoleGuard, Roles } from '@/auth/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles('Admin')
@Controller('mention')
export class MentionController {
  constructor(private service: MentionService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async callMentionData() {
    return this.service.getMentionData();
  }

  @HttpCode(HttpStatus.OK)
  @Get('student')
  async callStudentData(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.service.getStudentData(page, limit);
  }

  @HttpCode(HttpStatus.OK)
  @Get('student/:name')
  async callSearchStudent(@Query('name') query: string) {
    return this.service.searchStudent(query);
  }

  @Post('register')
  async callRegister(@Body() user: UserEntity) {
    return this.service.callRegister(user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('payload')
  @UseInterceptors(new FastifyUploadInterceptor({ dest: './student_pictures' }))
  saveDocPayload(@Req() req: FastifyRequest) {
    if (!req.fileData) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      message: 'File uploaded successfully',
      file: {
        originalname: req.fileData.originalname,
        mimetype: req.fileData.mimetype,
        size: req.fileData.size,
        path: req.fileData.path,
        url: `/student_pictures/${req.fileData.originalname}`,
      },
    };
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

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteStudent(
    @Query('id') id: string,
    @Query('fileName') fileName: string,
  ) {
    return this.service.deleteStudent(id, fileName);
  }
}
