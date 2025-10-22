import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthPrismaService, AuthPrismaServiceImpl } from './aut.service.prisma';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthRepositoryImpl } from './auth.repository.impl';
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
