import { UserRole } from './user.entity';

export class RegisterDto {
  identifier: number;
  name: string;
  afterName: string;
  password: string;
  role: UserRole;

  level?: string;
  mention?: string;
  status?: string;
}
