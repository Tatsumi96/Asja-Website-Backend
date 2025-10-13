import { Result } from '@/core/Result';

export abstract class FileRepository<T> {
  abstract get(filename: string): Promise<Result<T>>;
  abstract delete(fileName: string): Promise<Result<void>>;
}
