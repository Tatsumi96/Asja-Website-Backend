import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './Auth_repository';
import { AuthPrismaRepository } from './Auth_Prisma_Repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: AuthRepository, useClass: AuthPrismaRepository },
  ],
})
export class AuthModule {}
