import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto } from '../core/dtos';
import { ProjectStatusDto } from '../core/dtos/project-status.dto';
import { ProjectStatusDocument } from '../core/schemas/project-status.schema';
import { ProjectStatusService } from './project-status.service';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { MongoExceptionFilter } from 'src/shared/filters/mongo-exception.filter';

@ApiBearerAuth()
@ApiTags('Project Status')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('project-status')
export class ProjectStatusController {
    constructor(private readonly projectStatusService: ProjectStatusService) {}

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
        description: 'Number of records per page',
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
    async getAllProjectStatuses(@Query() {limit, page}: PaginationDto,
    @Query() {search, sort}) {
        return await this.projectStatusService.getAllProjectStatuses(limit, page, search, sort);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getProjectStatusById(@Param('id') id: string): Promise<ProjectStatusDocument> {
        return await this.projectStatusService.getProjectStatusById(id);
    }

    @Post()
    async createProjectStatus(@Body() projectStatusDto: ProjectStatusDto) {
        return await this.projectStatusService.createProjectStatus(projectStatusDto);
    }

    @Patch(':id')
    async updateProjectStatus(@Param('id') id: string, @Body() projectStatusDto: ProjectStatusDto) {
        return await this.projectStatusService.updateProjectStatus(id, projectStatusDto);
    }

    @Delete(':id')
    async deleteProjectStatus(@Param('id') id: string) {
        return await this.projectStatusService.deleteProjectStatus(id);
    }
}
