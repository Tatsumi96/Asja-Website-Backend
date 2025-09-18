import { BadRequestException, Injectable } from '@nestjs/common';
import { DocRepository } from './doc.repository';
import { DocEntity } from './doc.entity';

@Injectable()
export class DocService {
  constructor(private docRepositoy: DocRepository) {}

  async saveDocMetaData(doc: DocEntity) {
    const result = await this.docRepositoy.save(doc);
    if (result.status == 'failure') throw new BadRequestException();
  }
}
