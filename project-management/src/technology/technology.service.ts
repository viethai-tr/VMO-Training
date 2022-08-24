import { Injectable } from '@nestjs/common';
import { TechnologyDto } from 'src/core/dtos/technology.dto';
import { TechnologyDocument } from 'src/core/schemas/technology.schema';
import { TechnologyRepository } from './technology.repository';

@Injectable()
export class TechnologyService {
    constructor(
        private technologyRepository: TechnologyRepository
    ) { }

    async getAllTechnologies(limit?: number, page?: number): Promise<TechnologyDocument[]> {
        return await this.technologyRepository.getAll(limit, page);
    }

    async getTechnologyById(id: string): Promise<TechnologyDocument> {
        return await this.technologyRepository.getById(id);
    }

    async updateTechnology(id: string, technologyDto: TechnologyDto) {
        return await this.technologyRepository.update(id, <TechnologyDocument>(technologyDto));
    }

    async createTechnology(technologyDto: TechnologyDto) {
        return await this.technologyRepository.create(<TechnologyDocument>(technologyDto));
    }

    async deleteTechnology(id: string) {
        return await this.technologyRepository.deleteTechnology(id);
    }
}
