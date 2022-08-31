import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectCountDto } from '../core/dtos/project-count.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto, ProjectDto } from '../core/dtos';
import { ProjectDocument } from '../core/schemas/project.schema';
import { ProjectService } from './project.service';
import Role from '../core/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Project')
@Roles(Role.Admin)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    @Roles(Role.Admin, Role.User)
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
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Type of sort',
        enum: ['asc', 'desc'],
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        description: 'Sort by',
        enum: ['name', 'starting_date'],
    })
    async getAllProjects(@Query() {limit, page}: PaginationDto, @Query() {sort, sortBy}): Promise<ProjectDocument[]> {
        return await this.projectService.getAllProjects(limit, page, sort, sortBy);
    }

    @Roles(Role.Admin, Role.User)
    @Get('count')
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Project status',
        type: 'string'
    })
    @ApiQuery({
        name: 'type',
        required: false,
        description: 'Project type',
        type: 'string'
    })
    @ApiQuery({
        name: 'customer',
        required: false,
        description: 'Customer',
        type: 'string'
    })
    @ApiQuery({
        name: 'technology',
        required: false,
        description: 'Technology',
        type: 'string'
    })
    @ApiQuery({
        name: 'startingDate',
        required: false,
        description: 'Starting date of project',
        type: 'string'
    })
    async countProjects(@Query() {type, status, customer, technology, startingDate}: ProjectCountDto) {
        return await this.projectService.countProjects(type, status, customer, technology, startingDate);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id/employee')
    async getEmployeesProject(@Param('id') id: string) {
        return this.projectService.getEmployeesProject(id);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getProjectById(@Param('id') id: string): Promise<ProjectDocument> {
        return this.projectService.getProjectById(id);
    }

    @Patch(':id')
    async updateProject(@Param('id') id: string, @Body() projectDto: ProjectDto) {
        return await this.projectService.updateProject(id, projectDto);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: string) {
        return await this.projectService.deleteProject(id);
    }
}
