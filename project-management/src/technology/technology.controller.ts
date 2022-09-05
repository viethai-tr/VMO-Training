import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto } from '../core/dtos';
import { TechnologyDto } from '../core/dtos/technology.dto';
import { TechnologyDocument } from '../core/schemas/technology.schema';
import { TechnologyService } from './technology.service';
import { HttpExceptionFilter } from '../shared/filters/http-exception.filter';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';

@ApiBearerAuth()
@ApiTags('Technology')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('technology')
export class TechnologyController {
    constructor(private technologyService: TechnologyService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search',
        type: 'string',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of employees per page',
        type: 'integer',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page',
        type: 'integer',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Type of sort',
        enum: ['asc', 'desc'],
    })
    async getAllTechnologies(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, search },
    ) {
        return this.technologyService.getAllTechnologies(
            limit,
            page,
            search,
            sort,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getTechnologyById(
        @Param('id') id: string,
    ): Promise<TechnologyDocument> {
        return this.technologyService.getTechnologyById(id);
    }

    @Post()
    async createTechnology(@Body() technologyDto: TechnologyDto) {
        return this.technologyService.createTechnology(
            <TechnologyDocument>(technologyDto),
        );
    }

    @Patch(':id')
    async updateTechnology(
        @Param('id') id: string,
        @Body() technologyDto: TechnologyDto,
    ) {
        return this.technologyService.updateTechnology(
            id,
            <TechnologyDocument>(technologyDto),
        );
    }

    @Delete(':id')
    async deleteTechnology(@Param('id') id: string) {
        return this.technologyService.deleteTechnology(id);
    }
}
