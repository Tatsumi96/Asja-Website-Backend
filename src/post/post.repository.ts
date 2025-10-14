import { Result } from '@/core/Result';
import { GetPostInputType, PostEntity } from './post.entity';
import { PostDto } from './post.dto';

export abstract class PostRepository {
  abstract create(
    post: PostEntity,
  ): Promise<Result<{ id: string; date: string }>>;
  abstract get(params: GetPostInputType): Promise<Result<PostDto[]>>;
  abstract delete(id: string): Promise<Result<void>>;
}
