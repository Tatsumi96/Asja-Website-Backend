import { Branche, Level, Mention } from '@/core/types';

export interface PostEntity {
  description: string;
  title: string;
  branche: Branche;
  level: Level;
  mention: Mention;
  fileName?: string;
}

export interface GetPostInputType {
  page: number;
  limit: number;
  level: Level;
  branche: Branche;
  mention: Mention;
}
