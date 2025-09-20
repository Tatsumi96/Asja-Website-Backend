export type role = 'Student' | 'Teacher';

export type Mention =
  | { principale: 'Informatique'; branche: 'DAI' | 'TCO' | 'GI' }
  | { principale: 'Economie'; branche: 'ED' | 'GCI' }
  | { principale: 'Droit'; branche: 'Affaire' | 'privé' | 'public' }
  | { principale: 'Science de la Terre'; branche: 'Mine' | 'Hydro' }
  | { principale: 'Agronomie'; branche: 'Alimentaire' | 'Elevage' }
  | 'LEA';

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
