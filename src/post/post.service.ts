import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { GetPostInputType, PostEntity } from './post.entity';
import { FileRepository } from '@/file/file.repository';
import { fileReturnedType } from '@/file/file.repository.Impl';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private fileRepository: FileRepository<fileReturnedType>,
  ) {}

  async createPost(post: PostEntity) {
    const result = await this.postRepository.create(post);
    if (result.status == 'failure') throw new BadRequestException();

    return result.data;
  }

  async getPost(params: GetPostInputType) {
    const result = await this.postRepository.get(params);
    if (result.status == 'failure') throw new BadRequestException();
    return result.data;
  }

  async callGetFile(fileName: string) {
    const result = await this.fileRepository.get(fileName);
    if (result.status == 'failure') throw new ForbiddenException();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { mimeType: result.data.mimetype, stream: result.data.file };
  }

  async delete(id: string, fileName: string) {
    const result = await this.postRepository.delete(id);
    if (result.status == 'failure')
      throw new ForbiddenException('Erreur on delete post');
    if (fileName == 'undefined') return;
    const resultFile = await this.fileRepository.delete(fileName);
    if (resultFile.status == 'failure')
      throw new ForbiddenException('Error on delete file');
  }
}
