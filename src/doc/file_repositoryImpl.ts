import { join } from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { Result, success } from '@/core/Result';

import * as mime from 'mime-types';
import { FileRepository } from './fileRepository';

export interface fileReturnedType {
  mimetype: any;
  file: fs.ReadStream;
}

export class FileRepositoryImpl implements FileRepository<fileReturnedType> {
  private basePath = join(process.cwd(), 'files');

  async get(fileName: string): Promise<Result<fileReturnedType>> {
    if (fileName.includes('..') || fileName.includes('/')) {
      throw new Error();
    }
    const filePath = join(this.basePath, fileName);

    try {
      await fsPromises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const contentType = mime.lookup(filePath) || 'application/octet-stream';

      const stream = fs.createReadStream(filePath);

      stream.on('error', (err) => {
        console.error('Erreur lors du streaming :', err);
        throw new Error();
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return success({ mimetype: contentType, file: stream });
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error.code === 'ENOENT') {
        throw new Error();
      } else if (error.code === 'EACCES') {
        throw new Error();
      } else {
        throw new Error();
      }
    }
  }

  async save(): Promise<void> {}
}
