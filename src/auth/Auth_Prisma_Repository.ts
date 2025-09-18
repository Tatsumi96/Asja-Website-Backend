import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { failure, Result, success } from '@/core/Result';
import { LoginDto } from '@/auth/login_Dto';
import { UserNotFoundException } from './exception';
import { AuthRepository } from './Auth_repository';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthPrismaRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(userId: number): Promise<Result<LoginDto>> {
    try {
      const user = await this.prisma.student.findFirst({
        where: { Matricule: userId },
        select: { MotDePasse: true },
      });

      if (!user) return failure(new UserNotFoundException());

      return success({
        identifier: userId,
        password: user.MotDePasse,
      });
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }

  async register(user: UserEntity): Promise<Result<void>> {
    try {
      await this.prisma.student.create({
        data: {
          Matricule: user.matricule,
          Nom: user.name,
          Prenom: user.afterName,
          Mention: user.mention,
          Niveau: user.level,
          MotDePasse: user.password,
        },
      });

      return success(undefined);
    } catch (error) {
      console.error(error);

      return failure(new Error());
    }
  }
}
