import { BadRequestException, Injectable } from '@nestjs/common';
import { TechnologyDto } from 'src/core/dtos/technology.dto';
import { TechnologyDocument } from 'src/core/schemas/technology.schema';
import { checkObjectId } from 'src/shared/checkObjectId';
import { TechnologyRepository } from './technology.repository';

@Injectable()
export class TechnologyService {
    constructor(private technologyRepository: TechnologyRepository) {}

    async getAllTechnologies(
        limit?: number,
        page?: number,
        search?: string,
        sort?: string,
    ) {
        return this.technologyRepository.getAll(
            limit,
            page,
            search,
            sort,
        );
    }

    async getTechnologyById(id: string): Promise<TechnologyDocument> {
        checkObjectId(id);
        return this.technologyRepository.getById(id);
    }

    async updateTechnology(id: string, technologyDto: TechnologyDto) {
        checkObjectId(id);
        return this.technologyRepository.update(
            id,
            <TechnologyDocument>technologyDto,
        );
    }

    async createTechnology(technologyDto: TechnologyDto) {
        return this.technologyRepository.create(
            <TechnologyDocument>technologyDto,
        );
    }

    async deleteTechnology(id: string) {
        checkObjectId(id);
        return this.technologyRepository.deleteTechnology(id);
    }
}
