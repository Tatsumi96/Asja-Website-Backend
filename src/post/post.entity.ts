import { Branche, Level, Mention, Role } from '@/core/types';

export interface PostEntity {
  description: string;
  title: string;
  branche: Branche;
  level: Level;
  mention: Mention;
  imageUrl?: string | undefined;
}

export interface GetPostInputType {
  page: number;
  limit: number;
  level: Level;
  branche: Branche;
  mention: Mention;
  role: Role;
}
