import { Level, Mention, Role } from '@/core/types';

export class RegisterDto {
  name: string;
  afterName: string;
  password: string;
  contact: string;
  role: Role;
  level?: Level;
  mention?: Mention;
  grade?: string;
}
