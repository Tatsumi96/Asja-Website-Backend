/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { MentionDto } from './mention.dto';
import { Branche, Level, Mention } from '@/core/types';
import { UserDto } from './user.dto';
import { RegisterReturnType } from './registerReturnType';

export abstract class MentionPrismaService {
  abstract getMentionData(): Promise<MentionDto>;
  abstract getStudentData(page: number, limit: number): Promise<UserDto[]>;

  abstract register(user: UserEntity): Promise<RegisterReturnType>;
  abstract deleteStudent(id: string): Promise<void>;

  abstract searchStudent(query: string): Promise<UserDto[]>;
}

@Injectable()
export class MentionPrismaServiceImpl implements MentionPrismaService {
  constructor(private prisma: PrismaService) {}

  private getBranchesForMention(mention: string): { [key: string]: string } {
    const branchMapping: { [key: string]: { [key: string]: string } } = {
      DROIT: {
        AFFAIRES: 'AFFAIRES',
        PROCESSUEL: 'PROCESSUEL',
      },
      INFORMATIQUE: {
        TELECOMMUNICATION: 'TELECOMMUNICATION',
        'GENIE LOGICIEL': 'GENIE_LOGICIEL',
        'GENIE INDUSTRIEL': 'GENIE_INDUSTRIEL',
      },
      'SCIENCE DE LA TERRE': {
        HYDROGEOLOGIE: 'HYDROGEOLOGIE',
        'GEOLOGIE MINIERE': 'GEOLOGIE_MINIERE',
      },
      ECONOMIE: {
        'ECONOMIE ET DEVELOPPEMENT': 'ECONOMIE_ET_DEVELOPPEMENT',
        'GESTION ET COMMERCE INTERNATIONAL':
          'GESTION_ET_COMMERCE_INTERNATIONAL',
      },
      AGRONOMIE: {
        AGROALIMENTAIRE: 'AGROALIMENTAIRE',
        'PRODUCTION VEGETALE': 'PRODUCTION_VEGETALE',
        'PRODUCTION ANIMAL': 'PRODUCTION_ANIMAL',
      },
    };

    return branchMapping[mention] || {};
  }

  private shouldIncludeBranch(branche: string, level: Level): boolean {
    const l3PlusBranches: Branche[] = [
      'GENIE LOGICIEL',
      'GENIE INDUSTRIEL',
      'TELECOMMUNICATION',
      'AFFAIRES',
      'PROCESSUEL',
      'HYDROGEOLOGIE',
      'GEOLOGIE MINIERE',
      'ECONOMIE ET DEVELOPPEMENT',
      'GESTION ET COMMERCE INTERNATIONAL',
      'AGROALIMENTAIRE',
      'PRODUCTION VEGETALE',
      'PRODUCTION ANIMAL',
    ];

    if (level === 'L1' || level === 'L2') {
      return !l3PlusBranches.includes(branche as Branche);
    }

    return true;
  }

  async getMentionData(): Promise<MentionDto> {
    const mentions = await this.prisma.mention.findMany({
      select: {
        Mention: true,
        Branche: true,
        Niveau: true,
        _count: true,
      },
      orderBy: [{ Branche: 'asc' }, { Niveau: 'asc' }],
    });

    const levels: Level[] = ['L1', 'L2', 'L3', 'M1', 'M2'];
    const mentionTypes = [
      'DROIT',
      'INFORMATIQUE',
      'SCIENCE DE LA TERRE',
      'ECONOMIE',
      'AGRONOMIE',
      'LANGUE ET CULTURE',
    ];

    const result = mentionTypes.reduce(
      (acc, mention) => {
        const mentionStudents = mentions.filter(
          (item) => item.Mention === mention,
        );

        const formattedMention = mention.replace(/ /g, '_');
        const mentionBranches = this.getBranchesForMention(mention);

        acc[formattedMention] = {
          totalStudent: mentionStudents.length,
          data: levels.map((level) => {
            const levelMentions = mentions.filter(
              (item) =>
                item.Mention === mention &&
                item.Niveau === level &&
                this.shouldIncludeBranch(item.Branche, level),
            );

            const levelData: any = {
              level,
              studentNumber: levelMentions.length,
            };

            if (level === 'L3' || level === 'M1' || level === 'M2') {
              Object.entries(mentionBranches).forEach(
                ([originalBranche, formattedBranche]) => {
                  const branchStudents = levelMentions.filter(
                    (item) => item.Branche === originalBranche,
                  );

                  if (branchStudents.length > 0) {
                    levelData[formattedBranche] = {
                      studentNumber: branchStudents.reduce(
                        (sum, item) => sum + item._count.etudiant,
                        0,
                      ),
                    };
                  }
                },
              );
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return levelData;
          }),
        };

        return acc;
      },
      {} as { [key: string]: any },
    );

    return result as MentionDto;
  }

  async register(user: UserEntity): Promise<RegisterReturnType> {
    return this.registerStudent(user);
  }

  async registerStudent(user: UserEntity): Promise<RegisterReturnType> {
    let randomId = this.generateRandomId();
    let isExist = await this.isStudentIdExist(randomId);
    while (isExist) {
      randomId = this.generateRandomId();
      isExist = await this.isStudentIdExist(randomId);
    }

    const result = await this.prisma.mention.create({
      data: {
        Branche: user.branche,
        Niveau: user.level as string,
        Mention: user.mention as string,
        etudiant: {
          create: {
            contact: user.contact,
            Matricule: randomId,
            Nom: user.name,
            Prenom: user.lastName,
            MotDePasse: user.password,
            filePictureName: user.fileName,
            Tranche: {
              create: {
                Premier: user.Premier,
                Deuxieme: user.Deuxieme,
                Troisieme: user.Troisieme,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    const trancheId = await this.prisma.tranche.findFirst({
      where: { studentMatricule: randomId },
      select: { id: true },
    });

    return {
      mentionId: result.id,
      trancheId: trancheId?.id as string,
      identifier: randomId,
    };
  }

  async isStudentIdExist(randomId: number): Promise<boolean | undefined> {
    const isExist = await this.prisma.student.findUnique({
      where: { Matricule: randomId },
    });
    if (!isExist) return false;
    return true;
  }

  generateRandomId(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async getStudentData(page: number, limit: number): Promise<UserDto[]> {
    const resultStudent = await this.prisma.student.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        Nom: true,
        Prenom: true,
        contact: true,
        Matricule: true,
        filePictureName: true,
        Classe: { select: { Mention: true, Niveau: true, Branche: true } },
      },
    });
    const mentionStudent: UserDto[] = [];

    for (const student of resultStudent) {
      const trancheOne = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { Premier: true },
      });
      const trancheTwo = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { Deuxieme: true },
      });
      const trancheThree = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { Troisieme: true },
      });

      const trancheId = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { id: true },
      });

      const mentionId = await this.prisma.student.findFirst({
        where: { Matricule: student.Matricule },
        select: { MentionId: true },
      });

      mentionStudent.push({
        name: student.Nom,
        lastName: student.Prenom,
        branche: student.Classe.Branche as Branche,
        level: student.Classe.Niveau as Level,
        mention: student.Classe.Mention as Mention,
        contact: student.contact,
        identifier: student.Matricule,
        imageUrl: student.filePictureName as string,
        mentionId: mentionId?.MentionId as string,
        trancheId: trancheId?.id as string,
        Premier: trancheOne?.Premier as boolean,
        Deuxieme: trancheTwo?.Deuxieme as boolean,
        Troisieme: trancheThree?.Troisieme as boolean,
      });
    }

    return mentionStudent;
  }

  async deleteStudent(id: string): Promise<void> {
    await this.prisma.mention.delete({
      where: { id },
    });
  }

  async searchStudent(query: string): Promise<UserDto[]> {
    const result: {
      Matricule: number;
      Nom: string;
      Prenom: string;
      contact: string;
      filePictureName: string;
      MentionId: string;
    }[] = await this.prisma.$queryRawUnsafe(
      `SELECT "Matricule","Nom","Prenom","contact","filePictureName","MentionId" FROM "Student"
     WHERE "Nom" ILIKE '%' || $1 || '%'
        OR "Prenom" ILIKE '%' || $1 || '%'
        OR SIMILARITY("Nom", $1) > 0.3 
        OR SIMILARITY("Prenom", $1) > 0.3
     ORDER BY GREATEST(SIMILARITY("Nom", $1), SIMILARITY("Prenom", $1)) DESC
     LIMIT 5;`,
      query,
    );

    const data: UserDto[] = [];

    for (const student of result) {
      const resultMention = await this.prisma.mention.findFirst({
        where: { id: student.MentionId },
        select: {
          Branche: true,
          Niveau: true,
          Mention: true,
        },
      });

      const trancheOne = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { Premier: true },
      });
      const trancheTwo = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { Deuxieme: true },
      });
      const trancheThree = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { Troisieme: true },
      });

      const trancheId = await this.prisma.tranche.findFirst({
        where: { studentMatricule: student.Matricule },
        select: { id: true },
      });

      data.push({
        name: student.Nom,
        lastName: student.Prenom,
        branche: resultMention?.Branche as Branche,
        level: resultMention?.Niveau as Level,
        mention: resultMention?.Mention as Mention,
        contact: student.contact,
        identifier: student.Matricule,
        imageUrl: student.filePictureName,
        mentionId: student.MentionId,
        trancheId: trancheId?.id as string,
        Premier: trancheOne?.Premier as boolean,
        Deuxieme: trancheTwo?.Deuxieme as boolean,
        Troisieme: trancheThree?.Troisieme as boolean,
      });
    }

    return data;
  }
}
