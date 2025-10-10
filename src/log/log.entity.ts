import { Action } from '@/core/types';

export interface LogEntity {
  date: string;
  description: string;
  action: Action;
}
