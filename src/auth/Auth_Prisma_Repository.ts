import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto, LoginReturnType } from '@/auth/login_Dto';
import { UserNotFoundException } from './exception';
import { UserEntity } from './user.entity';
import { Level, Mention } from '@/core/types';

export abstract class AuthPrismaService {
  abstract signIn(loginData: LoginDto): Promise<LoginReturnType>;
  abstract register(user: UserEntity): Promise<void>;
}

@Injectable()
export class AuthPrismaServiceImpl implements AuthPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(loginData: LoginDto): Promise<LoginReturnType> {
    if (loginData.role == 'User') {
      const user = await this.prisma.student.findFirst({
        where: { Matricule: loginData.identifier },
        select: {
          MotDePasse: true,
          Mention: true,
          Niveau: true,
        },
      });
      if (!user) throw new UserNotFoundException();

      return {
        identifier: loginData.identifier,
        password: user?.MotDePasse,
        level: user.Niveau as Level,
        mention: user.Mention as Mention,
        role: loginData.role,
      };
    } else {
      throw new Error();
    }
  }

  async register(user: UserEntity): Promise<void> {
    if (user.role == 'User') await this.registerStudent(user);
  }

  async registerStudent(user: UserEntity): Promise<void> {
    let randomId = this.generateRandomId();
    let isExist = await this.isStudentIdExist(randomId);
    while (isExist) {
      randomId = this.generateRandomId();
      isExist = await this.isStudentIdExist(randomId);
    }

    await this.prisma.student.create({
      data: {
        Matricule: randomId,
        Nom: user.name,
        Prenom: user.afterName,
        contact: user.contact,
        Mention: user.mention as string,
        Niveau: user.level as string,
        Branche: user.branche,
        MotDePasse: user.password,
      },
    });
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
}
