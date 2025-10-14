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
import { PostService } from './post.service';
import { PostEntity } from './post.entity';

import { Request } from 'express';
import { Branche, Level, Mention, Role } from '@/core/types';
import { AuthGuard } from '@nestjs/passport';

import { FastifyUploadInterceptor } from './fastifyInterceptor';

import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('post')
export class PostController {
  constructor(private service: PostService) {}

  @Post()
  async create(@Body() post: PostEntity) {
    return this.service.createPost(post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async get(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Req() req: Request,
  ) {
    const userData = req.user as {
      mention: Mention;
      level: Level;
      branche: Branche;
      role: Role;
    };
    return this.service.getPost({
      branche: userData.branche,
      level: userData.level,
      mention: userData.mention,
      page: page,
      limit: limit,
      role: userData.role,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @Post('payload')
  @UseInterceptors(new FastifyUploadInterceptor({ dest: './post_pictures' }))
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
        url: `/post_pictures/${req.fileData.originalname}`,
      },
    };
  }

  // @UseGuards(AuthGuard('jwt'))
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

  @HttpCode(HttpStatus.OK)
  @Delete()
  async delete(@Query('id') id: string, @Query('fileName') fileName: string) {
    return this.service.delete(id, fileName);
  }
}
