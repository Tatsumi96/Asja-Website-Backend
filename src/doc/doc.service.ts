import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DocRepository, getDocFileInputType } from './doc.repository';
import { DocEntity } from './doc.entity';
import { FileRepository } from './fileRepository';
import { fileReturnedType } from './file_repositoryImpl';

@Injectable()
export class DocService {
  constructor(
    private docRepositoy: DocRepository,
    private fileRepository: FileRepository<fileReturnedType>,
  ) {}

  async saveDocMetaData(doc: DocEntity) {
    const result = await this.docRepositoy.save(doc);
    if (result.status == 'failure') throw new BadRequestException();
  }

  async getDocFile(params: getDocFileInputType) {
    const result = await this.docRepositoy.get(params);
    if (result.status == 'failure') throw new BadRequestException();
    return result.data;
  }

  async callGetFile(fileName: string) {
    const result = await this.fileRepository.get(fileName);
    if (result.status == 'failure') throw new ForbiddenException();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { mimeType: result.data.mimetype, stream: result.data.file };
  }
}
