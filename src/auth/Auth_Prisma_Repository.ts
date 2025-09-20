import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto, LoginReturnType } from '@/auth/login_Dto';
import { UserNotFoundException } from './exception';
import { Mention, UserEntity } from './user.entity';

export abstract class AuthPrismaService {
  abstract signIn(loginData: LoginDto): Promise<LoginDto>;
  abstract register(user: UserEntity): Promise<void>;
}

@Injectable()
export class AuthPrismaServiceImpl implements AuthPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(loginData: LoginDto): Promise<LoginReturnType> {
    if (loginData.role == 'Student') {
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
        level: user.Niveau,
        mention: user.Mention as Mention,
        role: loginData.role,
      };
    } else if (loginData.role == 'Teacher') {
      const user = await this.prisma.teacher.findFirst({
        where: { id: loginData.identifier },
        select: { MotDePasse: true, Grade: true },
      });
      if (!user) throw new UserNotFoundException();
      return {
        identifier: loginData.identifier,
        password: user?.MotDePasse,
        grade: user.Grade,
        role: loginData.role,
      };
    } else {
      throw new Error();
    }
  }

  async register(user: UserEntity): Promise<void> {
    if (user.role == 'Student') {
      await this.registerStudent(user);
    } else if (user.role == 'Teacher') {
      await this.registerTeacher(user);
    }
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

  async isTeacherIdExist(randomId: number): Promise<boolean | undefined> {
    const isExist = await this.prisma.teacher.findUnique({
      where: { id: randomId },
    });
    if (!isExist) return false;
    return true;
  }

  generateRandomId(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async registerTeacher(user: UserEntity) {
    let randomId = this.generateRandomId();
    let isExist = await this.isTeacherIdExist(randomId);
    while (isExist) {
      randomId = this.generateRandomId();
      isExist = await this.isStudentIdExist(randomId);
    }

    await this.prisma.teacher.create({
      data: {
        id: randomId,
        Nom: user.name,
        Prenom: user.afterName,
        contact: user.contact,
        Grade: user.grade as string,
        MotDePasse: user.password,
      },
    });
  }
}
