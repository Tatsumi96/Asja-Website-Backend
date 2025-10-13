import { PrismaService } from '@/prisma/prisma.service';
import type { UserDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { Branche, Level, Mention } from '@/core/types';

export abstract class UserPrismaService {
  abstract get(userId: number): Promise<UserDto>;
}

@Injectable()
export class UserPrismaServiceImpl implements UserPrismaService {
  constructor(private prisma: PrismaService) {}

  async get(userId: number): Promise<UserDto> {
    const user = await this.prisma.student.findUnique({
      where: { Matricule: userId },
      select: {
        Nom: true,
        Prenom: true,
        filePictureName: true,
        Matricule: true,
        contact: true,
        Classe: { select: { Branche: true, Niveau: true, Mention: true } },
      },
    });
    const resultPremier = await this.prisma.tranche.findFirst({
      where: { studentMatricule: user?.Matricule },
      select: { Premier: true },
    });
    const resultDeuxieme = await this.prisma.tranche.findFirst({
      where: { studentMatricule: user?.Matricule },
      select: { Deuxieme: true },
    });
    const resultTroisieme = await this.prisma.tranche.findFirst({
      where: { studentMatricule: user?.Matricule },
      select: { Troisieme: true },
    });

    if (!user) throw new Error();
    return {
      identifier: user.Matricule,
      name: user.Nom,
      lastName: user.Prenom,
      contact: user.contact,
      imageUrl: user.filePictureName as string,
      mention: user.Classe.Mention as Mention,
      branche: user.Classe.Branche as Branche,
      level: user.Classe.Niveau as Level,
      Premier: resultPremier?.Premier as boolean,
      Deuxieme: resultDeuxieme?.Deuxieme as boolean,
      Troisieme: resultTroisieme?.Troisieme as boolean,
    };
  }
}
