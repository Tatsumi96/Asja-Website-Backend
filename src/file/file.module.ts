import { DynamicModule, Module } from '@nestjs/common';
import { FileRepositoryImpl, fileReturnedType } from './file.repository.Impl';
import { FileRepository } from './file.repository';

@Module({})
export class FileModule {
  static forFeature(uploadDir: string): DynamicModule {
    return {
      module: FileModule,
      providers: [
        {
          provide: FileRepository,
          useFactory: (): FileRepository<fileReturnedType> => {
            return new FileRepositoryImpl(uploadDir);
          },
        },
      ],
      exports: [FileRepository],
    };
  }
}
