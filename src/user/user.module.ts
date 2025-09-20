import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import {
  UserPrismaService,
  UserPrismaServiceImpl,
} from './user_prisma_service';
import { UserRepository } from './user.repository';
import { UserRepositoryImpl } from './user.repositoryImpl';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: UserPrismaService, useClass: UserPrismaServiceImpl },
  ],
})
export class UserModule {}
