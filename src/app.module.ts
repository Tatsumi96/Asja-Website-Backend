import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { DocModule } from './doc/doc.module';
import { LogModule } from './log/log.module';
import { MentionModule } from './mention/mention.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { TrancheModule } from './tranche/tranche.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AdminModule,
    AuthModule,
    DocModule,
    StudentModule,
    MentionModule,
    TrancheModule,
    LogModule,
    PostModule,
  ],
  controllers: [],
})
export class AppModule {}
