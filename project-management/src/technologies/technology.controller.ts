import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto } from '../core/dtos';
import { TechnologyDto } from './dtos/create.technology.dto';
import { TechnologyDocument } from '../core/schemas/technology.schema';
import { TechnologyService } from './technology.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { ParseObjectIdPipe } from '../shared/pipes/objectid.pipe';
import { Types } from 'mongoose';
import { UpdateTechnologyDto } from './dtos/update.technology.dto';

@ApiBearerAuth()
@ApiTags('Technology')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('technologies')
export class TechnologyController {
    constructor(private technologyService: TechnologyService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
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
        @Param('id', ParseObjectIdPipe) id: string,
    ): Promise<TechnologyDocument> {
        return this.technologyService.getTechnologyById(id);
    }

    @Post()
    @HttpCode(201)
    async createTechnology(@Body() technologyDto: TechnologyDto) {
        return this.technologyService.createTechnology(
            <TechnologyDocument>(technologyDto),
        );
    }

    @Patch(':id')
    async updateTechnology(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateTechnologyDto: UpdateTechnologyDto,
    ) {
        return this.technologyService.updateTechnology(
            id, updateTechnologyDto,
        );
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteTechnology(@Param('id', ParseObjectIdPipe) id: string) {
        return this.technologyService.deleteTechnology(id);
    }

    @Post('restore/:id')
    async restoreTechnology(@Param('id', ParseObjectIdPipe) id: string) {
        return this.technologyService.restoreTechnology(id);
    }
}
