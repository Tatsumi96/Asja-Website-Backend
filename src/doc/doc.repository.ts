import { Result } from '@/core/Result';
import { DocEntity } from './doc.entity';
import { DocDto } from './docDto';
import { Branche, Level, Mention } from '@/core/types';

export interface getDocFileInputType {
  page: number;
  limit: number;
  mention: Mention;
  level: Level;
  branche: Branche;
}

export abstract class DocRepository {
  abstract save(doc: DocEntity): Promise<Result<{ id: string }>>;
  abstract get(params: getDocFileInputType): Promise<Result<DocDto[]>>;
  abstract delete(id: string): Promise<Result<void>>;
}
