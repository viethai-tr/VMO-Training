import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto, ProjectTypeDto } from '../core/dtos';
import { ProjectType, ProjectTypeDocument } from '../core/schemas/project-type.schema';
import { ProjectTypeService } from './project-type.service';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { MongoExceptionFilter } from 'src/shared/filters/mongo-exception.filter';

@ApiBearerAuth()
@ApiTags('Project Type')
@Roles(Role.Admin)
@UseFilters(HttpExceptionFilter)
@UseFilters(MongoExceptionFilter)
@Controller('project-type')
export class ProjectTypeController {
    constructor(
        private projectTypeService: ProjectTypeService
    ) { }

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
    async getAllProjectTypes(@Query() { limit, page }: PaginationDto,
        @Query() { sort, search }) {
        return await this.projectTypeService.getAllProjectTypes(limit, page, search, sort);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getProjectTypeById(@Param('id') id: string): Promise<ProjectType> {
        return await this.projectTypeService.getProjectTypeById(id);
    }

    @Patch(':id')
    async updateProjectType(@Param('id') id: string, @Body() projectTypeDto: ProjectTypeDto) {
        return await this.projectTypeService.updateProjectType(id, <ProjectTypeDocument>(projectTypeDto));
    }

    @Post()
    async createProjectType(@Body() projectTypeDto: ProjectTypeDto) {
        return await this.projectTypeService.createProjectType(projectTypeDto);
    }

    @Delete(':id')
    async deleteProjectType(@Param('id') id: string) {
        return await this.projectTypeService.deleteProjectType(id);
    }
}
