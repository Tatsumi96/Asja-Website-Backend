import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto } from '@/auth/login_Dto';
import { UserNotFoundException } from './exception';
import { UserEntity } from './user.entity';

export abstract class AuthPrismaService {
  abstract signIn(loginData: LoginDto): Promise<LoginDto>;
  abstract register(user: UserEntity): Promise<void>;
}

@Injectable()
export class AuthPrismaServiceImpl implements AuthPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(loginData: LoginDto): Promise<LoginDto> {
    try {
      const user =
        loginData.role == 'Student'
          ? await this.prisma.student.findFirst({
              where: { Matricule: loginData.identifier },
              select: { MotDePasse: true },
            })
          : await this.prisma.teacher.findFirst({
              where: { id: loginData.identifier },
            });

      if (!user) throw new UserNotFoundException();

      return {
        identifier: loginData.identifier,
        password: user.MotDePasse,
        role: loginData.role,
      };
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async register(user: UserEntity): Promise<void> {
    try {
      if (user.role == 'Student') {
        await this.registerStudent(user);
      } else if (user.role == 'Teacher') {
        await this.registerTeacher(user);
      }
    } catch (error) {
      console.error(error);
      throw new Error();
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
    try {
      const isExist = await this.prisma.student.findUnique({
        where: { Matricule: randomId },
      });
      if (!isExist) return false;
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async isTeacherIdExist(randomId: number): Promise<boolean | undefined> {
    try {
      const isExist = await this.prisma.teacher.findUnique({
        where: { id: randomId },
      });
      if (!isExist) return false;
      return true;
    } catch (error) {
      console.error(error);
    }
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
