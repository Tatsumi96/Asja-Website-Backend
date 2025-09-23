import { Branche, Level, Mention } from '@/core/types';

export interface DocEntity {
  id?: string;
  lessonTitle: string;
  fileName: string;
  fileSize: number;
  authorName: string;
  mention: Mention;
  level: Level;
  branche: Branche;
}
