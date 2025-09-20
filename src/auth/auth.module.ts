import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './Auth_repository';
import {
  AuthPrismaService,
  AuthPrismaServiceImpl,
} from './Auth_Prisma_Repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthRepositoryImpl } from './auth_repositoryImpl';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: AuthPrismaService, useClass: AuthPrismaServiceImpl },
  ],
})
export class AuthModule {}
