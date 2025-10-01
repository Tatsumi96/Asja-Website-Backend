import { PrismaService } from '@/prisma/prisma.service';
import type { UserDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

export abstract class UserPrismaService {
  abstract get(userId: number): Promise<UserDto>;
  abstract register(user: UserEntity): Promise<void>;
}

@Injectable()
export class UserPrismaServiceImpl implements UserPrismaService {
  constructor(private prisma: PrismaService) {}

  async get(userId: number): Promise<UserDto> {
    const user = await this.prisma.student.findUnique({
      where: { Matricule: userId },
      select: { Nom: true },
    });

    if (!user) throw new Error();
    return { userName: user.Nom };
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
