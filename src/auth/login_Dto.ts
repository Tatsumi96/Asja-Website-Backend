import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsNumber()
  identifier: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  name?: string;
}
