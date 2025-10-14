import { failure, Result, success } from '@/core/Result';
import { DocEntity } from './doc.entity';
import { DocRepository, getDocFileInputType } from './doc.repository';

import { Injectable } from '@nestjs/common';
import { DocPrismaService } from './doc_prisma_service';
import { DocDto } from './docDto';

@Injectable()
export class DocRepositoryImpl implements DocRepository {
  constructor(private service: DocPrismaService) {}
  async save(doc: DocEntity): Promise<Result<{ id: string }>> {
    try {
      const result = await this.service.save(doc);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async get(params: getDocFileInputType): Promise<Result<DocDto[]>> {
    try {
      const docFile = await this.service.get(params);
      return success(docFile);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.service.delete(id);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
