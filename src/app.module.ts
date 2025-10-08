import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DocModule } from './doc/doc.module';
import { UserModule } from './user/user.module';
import { MentionModule } from './mention/mention.module';
import { TrancheModule } from './tranche/tranche.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DocModule,
    UserModule,
    MentionModule,
    TrancheModule,
  ],
  controllers: [],
})
export class AppModule {}
