import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { role } from './user.entity';

export class LoginDto {
  @IsNotEmpty()
  @IsNumber()
  identifier: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  name?: string;

  role: role;
}

export interface LoginReturnType {
  identifier: number;
  password: string;
  level?: string;
  mention?: string;
  role: role;
  grade?: string;
}
