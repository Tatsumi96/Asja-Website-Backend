import { failure, Result, success } from '@/core/Result';
import { DocEntity } from './doc.entity';
import { DocRepository } from './doc.repository';

import { Injectable } from '@nestjs/common';
import { DocPrismaService } from './doc_prisma_service';

@Injectable()
export class DocRepositoryImpl implements DocRepository {
  constructor(private service: DocPrismaService) {}
  async save(doc: DocEntity): Promise<Result<void>> {
    try {
      await this.service.save(doc);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
