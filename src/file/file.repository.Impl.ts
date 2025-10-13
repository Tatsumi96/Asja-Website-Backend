import { join } from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { failure, Result, success } from '@/core/Result';

import * as mime from 'mime-types';
import { FileRepository } from './file.repository';
import { Injectable } from '@nestjs/common';

export interface fileReturnedType {
  mimetype: any;
  file: fs.ReadStream;
}

@Injectable()
export class FileRepositoryImpl implements FileRepository<fileReturnedType> {
  constructor(private readonly dirName: string) {}

  async get(fileName: string): Promise<Result<fileReturnedType>> {
    const basePath = join(process.cwd(), this.dirName);

    if (fileName.includes('..') || fileName.includes('/')) {
      throw new Error();
    }
    const filePath = join(basePath, fileName);

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'ENOENT') {
        throw new Error();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (error.code === 'EACCES') {
        throw new Error();
      } else {
        throw new Error();
      }
    }
  }
  async delete(fileName: string): Promise<Result<void>> {
    const basePath = join(process.cwd(), this.dirName);

    try {
      await fsPromises.unlink(`${basePath + fileName}`);
      return success(undefined);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
