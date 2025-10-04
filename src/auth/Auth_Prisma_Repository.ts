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
          Classe: { select: { Branche: true, Niveau: true, Mention: true } },
        },
      });
      if (!user) throw new UserNotFoundException();

      return {
        identifier: loginData.identifier,
        password: user?.MotDePasse,
        level: user.Classe.Niveau as Level,
        mention: user.Classe.Mention as Mention,
        role: loginData.role,
        branche: user.Classe.Branche as Branche,
      };
    } else {
      throw new Error();
    }
  }
}
