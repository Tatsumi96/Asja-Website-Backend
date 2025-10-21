import { FileModule } from '@/file/file.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import {
  AdminPrismaService,
  AdminPrismaServiceImpl,
} from './admin.prisma.service';
import { AdminRepository } from './admin.repository';
import { AdminRepositoryImpl } from './admin.repository.impl';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule, FileModule.forFeature('./admin_pictures/')],
  controllers: [AdminController],
  providers: [
    AdminService,
    { provide: AdminRepository, useClass: AdminRepositoryImpl },
    { provide: AdminPrismaService, useClass: AdminPrismaServiceImpl },
  ],
})
export class AdminModule {}
