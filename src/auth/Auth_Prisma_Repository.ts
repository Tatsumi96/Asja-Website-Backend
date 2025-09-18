import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto } from '@/auth/login_Dto';
import { UserNotFoundException } from './exception';
import { UserEntity } from './user.entity';

export abstract class AuthPrismaService {
  abstract signIn(userId: number): Promise<LoginDto>;
  abstract register(user: UserEntity): Promise<void>;
}

@Injectable()
export class AuthPrismaServiceImpl implements AuthPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(userId: number): Promise<LoginDto> {
    try {
      const user = await this.prisma.student.findFirst({
        where: { Matricule: userId },
        select: { MotDePasse: true },
      });

      if (!user) throw new UserNotFoundException();

      return {
        identifier: userId,
        password: user.MotDePasse,
      };
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async register(user: UserEntity): Promise<void> {
    try {
      await this.prisma.student.create({
        data: {
          Matricule: user.matricule,
          Nom: user.name,
          Prenom: user.afterName,
          Mention: user.mention as string,
          Niveau: user.level as string,
          MotDePasse: user.password,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}
