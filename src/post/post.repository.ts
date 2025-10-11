import { Result } from '@/core/Result';
import { GetPostInputType, PostEntity } from './post.entity';
import { PostDto } from './post.dto';

export abstract class PostRepository {
  abstract create(post: PostEntity): Promise<Result<void>>;
  abstract get(params: GetPostInputType): Promise<Result<PostDto[]>>;
}
