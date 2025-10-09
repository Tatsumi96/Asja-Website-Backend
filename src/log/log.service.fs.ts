import * as fsPromises from 'fs/promises';
import { LogEntity } from './log.entity';
import { Injectable } from '@nestjs/common';

import { join } from 'path';

export abstract class LogServiceFs {
  abstract write(log: LogEntity): Promise<void>;
  abstract read(): Promise<LogEntity[]>;
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

  async read(): Promise<LogEntity[]> {
    try {
      const data = await fsPromises.readFile(this.logFilePath, 'utf-8');
      if (!data.trim()) throw new Error();
      const logs: LogEntity[] = JSON.parse(data) as LogEntity[];
      return logs;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
