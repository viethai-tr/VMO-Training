import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto, ProjectTypeDto } from '../core/dtos';
import { ProjectType, ProjectTypeDocument } from '../core/schemas/project-type.schema';
import { ProjectTypeService } from './project-type.service';

@ApiBearerAuth()
@Controller('projecttype')
@ApiTags('Project Type')
export class ProjectTypeController {
    constructor(
        private projectTypeService: ProjectTypeService
    ) {}

    @Get()
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of employees per page',
        type: 'integer'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Current page',
        type: 'integer'
    })
    async getAllProjectTypes(@Query() {limit, page}: PaginationDto): Promise<ProjectType[]> {
        return await this.projectTypeService.getAllProjectTypes(limit, page);
    }

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