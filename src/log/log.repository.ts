import { Result } from '@/core/Result';
import { LogEntity } from './log.entity';

export abstract class LogRepository {
  abstract write(log: LogEntity): Promise<Result<void>>;
  abstract read(page: number, limit: number): Promise<Result<LogEntity[]>>;
}
