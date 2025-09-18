import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserEntity {
  @IsNumber()
  @IsNotEmpty()
  matricule: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  afterName: string;

  @IsString()
  @IsNotEmpty()
  mention: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
