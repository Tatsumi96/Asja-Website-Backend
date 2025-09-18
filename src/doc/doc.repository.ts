import { Result } from '@/core/Result';
import { DocEntity } from './doc.entity';

export abstract class DocRepository {
  abstract save(doc: DocEntity): Promise<Result<void>>;
}
