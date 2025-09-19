import { Result } from '@/core/Result';
import { DocEntity } from './doc.entity';

export interface getDocFileInputType {
  page: number;
  limit: number;
  mention: string;
  level: string;
}

export abstract class DocRepository {
  abstract save(doc: DocEntity): Promise<Result<void>>;
  abstract get(params: getDocFileInputType): Promise<Result<DocEntity[]>>;
}
