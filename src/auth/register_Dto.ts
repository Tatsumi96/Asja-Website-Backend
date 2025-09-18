import { role } from './user.entity';

export class RegisterDto {
  name: string;
  afterName: string;
  password: string;
  contact: string;
  role: role;
  level?: string;
  mention?: string;
  grade?: string;
}
