import { Module } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostRepositoryImpl } from './post.repository.impl';
import {
  PostPrismaService,
  PostPrismaServiceImpl,
} from './post.service..prisma';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { FileRepository } from './fileRepository';
import { FileRepositoryImpl } from './file_repositoryImpl';

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [
    PostService,
    { provide: PostRepository, useClass: PostRepositoryImpl },
    { provide: PostPrismaService, useClass: PostPrismaServiceImpl },
    { provide: FileRepository, useClass: FileRepositoryImpl },
  ],
})
export class PostModule {}
