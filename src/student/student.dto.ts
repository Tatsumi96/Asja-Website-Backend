import { Branche, Level, Mention } from '@/core/types';

export interface StudentDto {
  imageUrl: string | undefined;
  identifier: number;
  name: string;
  lastName: string;
  contact: string;
  mention: Mention;
  level: Level;
  branche: Branche;
  Premier: boolean;
  Deuxieme: boolean;
  Troisieme: boolean;
}
