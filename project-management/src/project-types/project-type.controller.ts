import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto, ProjectTypeDto } from '../core/dtos';
import { ProjectTypeDocument } from '../core/schemas/project-type.schema';
import { ProjectTypeService } from './project-types.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { ParseObjectIdPipe } from '../shared/pipes/objectid.pipe';
import { Types } from 'mongoose';

@ApiBearerAuth()
@ApiTags('Project Type')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('types')
export class ProjectTypeController {
    constructor(
        private projectTypeService: ProjectTypeService
    ) { }

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
    async getAllProjectTypes(@Query() { limit, page }: PaginationDto,
        @Query() { sort, search }) {
        return this.projectTypeService.getAllProjectTypes(limit, page, search, sort);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getProjectTypeById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.projectTypeService.getProjectTypeById(id);
    }

    @Patch(':id')
    async updateProjectType(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() projectTypeDto: ProjectTypeDto) {
        return this.projectTypeService.updateProjectType(id, <ProjectTypeDocument>(projectTypeDto));
    }

    @Post()
    async createProjectType(@Body() projectTypeDto: ProjectTypeDto) {
        return this.projectTypeService.createProjectType(projectTypeDto);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteProjectType(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.projectTypeService.deleteProjectType(id);
    }
}
