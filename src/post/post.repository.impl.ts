import { failure, Result, success } from '@/core/Result';
import { GetPostInputType, PostEntity } from './post.entity';
import { PostRepository } from './post.repository';
import { PostPrismaService } from './post.service.prisma';
import { Injectable } from '@nestjs/common';
import { PostDto } from './post.dto';

@Injectable()
export class PostRepositoryImpl implements PostRepository {
  constructor(private service: PostPrismaService) {}

  async create(
    post: PostEntity,
  ): Promise<Result<{ id: string; date: string }>> {
    try {
      const result = await this.service.create(post);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
  async get(params: GetPostInputType): Promise<Result<PostDto[]>> {
    try {
      const result = await this.service.get(params);
      return success(result);
    } catch (error) {
      console.error(error);
      return failure(new Error());
    }
  }
}
