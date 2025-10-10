import * as fsPromises from 'fs/promises';
import { LogEntity } from './log.entity';
import { Injectable } from '@nestjs/common';

import { join } from 'path';

export abstract class LogServiceFs {
  abstract write(log: LogEntity): Promise<void>;
  abstract read(page: number, limit: number): Promise<LogEntity[]>;
}

@Injectable()
export class LogServiceFsImpl implements LogServiceFs {
  private basePath = join(process.cwd(), 'src/log');
  private logFilePath: string = join(this.basePath, 'log.json');

  async write(log: LogEntity): Promise<void> {
    try {
      const data = await fsPromises.readFile(this.logFilePath, 'utf-8');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const logs: any[] = data.trim() ? JSON.parse(data) : [];
      logs.push(log);

      await fsPromises.writeFile(
        this.logFilePath,
        JSON.stringify(logs, null, 2),
      );
    } catch (error) {
      if (error.code === 'ENOENT') {
        const logs = [log];
        await fsPromises.writeFile(
          this.logFilePath,
          JSON.stringify(logs, null, 2),
        );
      } else {
        console.error(error);
        throw new Error();
      }
    }
  }
  async read(page: number = 1, limit: number = 3): Promise<LogEntity[]> {
    try {
      const data = await fsPromises.readFile(this.logFilePath, 'utf-8');

      if (!data.trim()) {
        return []; // fichier vide = aucun log
      }

      const logs: LogEntity[] = JSON.parse(data) as LogEntity[];

      const start = (page - 1) * limit;
      const end = start + limit;

      const logsToReturn = logs.slice(start, end);

      return logsToReturn;
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier de logs :', error);
      throw new Error('Impossible de lire les logs.');
    }
  }
}
