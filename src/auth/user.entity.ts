export type role = 'Student' | 'Teacher';

export class UserEntity {
  matricule: number;
  name: string;
  afterName: string;
  password: string;
  contact: string;
  role: role;
  mention?: string;
  level?: string;
  grade?: string;
}
