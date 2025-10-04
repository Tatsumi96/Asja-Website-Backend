import { PrismaService } from '@/prisma/prisma.service';
import type { UserDto } from './user.dto';
import { Injectable } from '@nestjs/common';

export abstract class UserPrismaService {
  abstract get(userId: number): Promise<UserDto>;
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
}
