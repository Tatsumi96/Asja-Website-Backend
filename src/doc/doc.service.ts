import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DocRepository, getDocFileInputType } from './doc.repository';
import { DocEntity } from './doc.entity';
import { FileRepository } from '@/file/file.repository';
import { fileReturnedType } from '@/file/file.repository.Impl';

@Injectable()
export class DocService {
  constructor(
    private docRepositoy: DocRepository,
    private fileRepository: FileRepository<fileReturnedType>,
  ) {}

  async saveDocMetaData(doc: DocEntity) {
    const result = await this.docRepositoy.save(doc);
    if (result.status == 'failure') throw new BadRequestException();
    return result.data;
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

  async delete(id: string, fileName: string) {
    const result = await this.docRepositoy.delete(id);
    if (result.status == 'failure')
      throw new ForbiddenException('Erreur on delete student');
    if (fileName == 'undefined') return;
    const resultFile = await this.fileRepository.delete(fileName);
    if (resultFile.status == 'failure')
      throw new ForbiddenException('Error on delete file');
  }
}
