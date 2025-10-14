import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import {
  StudentPrismaService,
  StudentPrismaServiceImpl,
} from './student.prisma.service';
import { StudentRepository } from './student.repository';
import { StudentRepositoryImpl } from './student.repository.impl';
import { StudentService } from './student.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentController],
  providers: [
    StudentService,
    { provide: StudentRepository, useClass: StudentRepositoryImpl },
    { provide: StudentPrismaService, useClass: StudentPrismaServiceImpl },
  ],
})
export class StudentModule {}
