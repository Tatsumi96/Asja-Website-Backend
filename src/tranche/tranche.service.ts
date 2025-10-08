import { BadRequestException, Injectable } from '@nestjs/common';
import { TrancheRepository } from './tranche.repository';

import { TrancheDto } from './tranche.dto';

@Injectable()
export class TrancheService {
  constructor(private trancheRepo: TrancheRepository) {}

  async updateTranche(dto: TrancheDto) {
    const result = await this.trancheRepo.update(dto);
    if (result.status == 'failure') throw new BadRequestException();
  }
}
