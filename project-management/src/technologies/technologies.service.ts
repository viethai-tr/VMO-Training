import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { TechnologyDto } from 'src/core/dtos/technology.dto';
import { TechnologyDocument } from 'src/core/schemas/technology.schema';
import { checkObjectId } from 'src/shared/utils/checkObjectId';
import { TechnologyRepository } from './technologies.repository';

@Injectable()
export class TechnologyService {
    constructor(private technologyRepository: TechnologyRepository) {}

    async getAllTechnologies(
        limit?: string,
        page?: string,
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
        return this.technologyRepository.getById(id);
    }

    async updateTechnology(id: string, technologyDto: TechnologyDto) {
        
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
        
        return this.technologyRepository.deleteTechnology(id);
    }
}
