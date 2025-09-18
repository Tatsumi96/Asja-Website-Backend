import { FastifyRequest } from 'fastify';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { DocService } from './doc.service';
import { DocEntity } from './doc.entity';
import { FastifyUploadInterceptor } from './fastifyInterceptor';

@Controller('doc')
export class DocController {
  constructor(private service: DocService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('metadata')
  saveDocMetaData(@Body() doc: DocEntity) {
    return this.service.saveDocMetaData(doc);
  }

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
}
