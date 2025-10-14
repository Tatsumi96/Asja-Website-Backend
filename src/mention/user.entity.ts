import { Branche, Level, Mention } from '@/core/types';

export class UserEntity {
  matricule?: number;
  name: string;
  lastName: string;
  password: string;
  contact: string;
  mention?: Mention;
  level?: Level;
  branche: Branche;
  grade?: string;
  Premier: boolean;
  Deuxieme: boolean;
  Troisieme: boolean;
  fileName: string;
}
