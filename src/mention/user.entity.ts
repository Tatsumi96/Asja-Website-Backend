import { Branche, Level, Mention, Role } from '@/core/types';

export class UserEntity {
  matricule?: number;
  name: string;
  lastName: string;
  password: string;
  contact: string;
  role: Role;
  mention?: Mention;
  level?: Level;
  branche: Branche;
  grade?: string;
}
