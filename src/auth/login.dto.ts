import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Branche, Level, Mention, Role } from '@/core/types';

export class LoginDto {
  @IsNotEmpty()
  @IsNumber()
  identifier: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  name?: string;
  role: Role;
}

export interface LoginReturnType {
  identifier: number;
  password: string;
  level?: Level;
  mention?: Mention;
  branche?: Branche;
  role: Role;
}
