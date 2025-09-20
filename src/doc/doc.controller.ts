import { FastifyReply, FastifyRequest } from 'fastify';
import {
  BadRequestException,
  Body,
  Controller,
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
import { DocService } from './doc.service';
import { DocEntity } from './doc.entity';
import { FastifyUploadInterceptor } from './fastifyInterceptor';
import { getDocFileInputType } from './doc.repository';
import { AuthGuard } from '@nestjs/passport';

@Controller('doc')
export class DocController {
  constructor(private service: DocService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @Post('metadata')
  saveDocMetaData(@Body() doc: DocEntity) {
    return this.service.saveDocMetaData(doc);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @Post('payload')
  @UseInterceptors(new FastifyUploadInterceptor({ dest: './files' }))
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
        url: `/files/${req.fileData.originalname}`,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stream/:filename')
  async streamFile(
    @Param('filename') fileName: string,
    @Query('disposition') disposition: 'attachment' | 'inline' = 'attachment',
    @Res() reply: FastifyReply,
  ) {
    try {
      const result = await this.service.callGetFile(fileName);
      reply.header('Content-Type', result.mimeType);
      reply.header(
        'Content-Disposition',
        `${disposition}; filename="${fileName}"`,
      );
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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getDocFile(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const params: getDocFileInputType = {
      page,
      limit,
      level: 'L2',
      mention: 'informatique',
    };

    return this.service.getDocFile(params);
  }
}
