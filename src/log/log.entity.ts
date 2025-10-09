import { Actions } from '@/core/types';

export interface LogEntity {
  date: string;
  description: string;
  action: Actions;
}
