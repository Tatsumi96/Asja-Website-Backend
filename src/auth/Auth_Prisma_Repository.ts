import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto, LoginReturnType } from '@/auth/login_Dto';
import { UserNotFoundException } from './exception';
import { Branche, Level, Mention } from '@/core/types';

export abstract class AuthPrismaService {
  abstract signIn(loginData: LoginDto): Promise<LoginReturnType>;
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
          Branche: true,
        },
      });
      if (!user) throw new UserNotFoundException();

      return {
        identifier: loginData.identifier,
        password: user?.MotDePasse,
        level: user.Niveau as Level,
        mention: user.Mention as Mention,
        role: loginData.role,
        branche: user.Branche as Branche,
      };
    } else {
      throw new Error();
    }
  }
}
