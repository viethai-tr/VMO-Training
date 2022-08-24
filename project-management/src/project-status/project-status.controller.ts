import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../core/dtos';
import { ProjectStatusDto } from '../core/dtos/project-status.dto';
import { ProjectStatusDocument } from '../core/schemas/project-status.schema';
import { ProjectStatusService } from './project-status.service';

@ApiBearerAuth()
@Controller('projectstatus')
@ApiTags('Project Status')
export class ProjectStatusController {
    constructor(private readonly projectStatusService: ProjectStatusService) {}

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
    async getAllProjectStatuses(@Query() {limit, page}: PaginationDto): Promise<ProjectStatusDocument[]> {
        return await this.projectStatusService.getAllProjectStatuses(limit, page);
    }

    @Get(':id')
    async getProjectStatusById(@Param('id') id: string): Promise<ProjectStatusDocument> {
        return await this.projectStatusService.getProjectStatusById(id);
    }

    @Post()
    async createProjectStatus(@Body() projectStatusDto: ProjectStatusDto) {
        return await this.projectStatusService.createProjectStatus(projectStatusDto);
    }

    @Put(':id')
    async updateProjectStatus(@Param('id') id: string, @Body() projectStatusDto: ProjectStatusDto) {
        return await this.projectStatusService.updateProjectStatus(id, projectStatusDto);
    }
}
