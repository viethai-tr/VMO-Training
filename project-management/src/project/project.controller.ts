import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectCountDto } from '../core/dtos/project-count.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto, ProjectDto } from '../core/dtos';
import { ProjectDocument } from '../core/schemas/project.schema';
import { ProjectService } from './project.service';
import Role from '../core/enums/role.enum';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from 'src/shared/const/variables.const';
import { PROJECT_COUNT, PROJECT_QUERY } from './project.const';

@ApiBearerAuth()
@ApiTags('Project')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    @Roles(Role.Admin, Role.User)
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
    @ApiQuery(PROJECT_QUERY.SORT_BY)
    async getAllProjects(
        @Query() { limit, page }: PaginationDto,
        @Query() { sort, sortBy, search },
    ) {
        return this.projectService.getAllProjects(
            limit,
            page,
            search,
            sort,
            sortBy,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get('count')
    @ApiQuery(PROJECT_COUNT.STATUS)
    @ApiQuery(PROJECT_COUNT.TYPE)
    @ApiQuery(PROJECT_COUNT.CUSTOMER)
    @ApiQuery(PROJECT_COUNT.TECHNOLOGY)
    @ApiQuery(PROJECT_COUNT.STARTING_DATE)
    async countProjects(
        @Query()
        { type, status, customer, technology, startingDate }: ProjectCountDto,
    ) {
        return this.projectService.countProjects(
            type,
            status,
            customer,
            technology,
            startingDate,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id/employee')
    async getEmployeesProject(@Param('id') id: string) {
        return this.projectService.getEmployeesProject(id);
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getProjectById(@Param('id') id: string) {
        return this.projectService.getProjectById(id);
    }

    @Post()
    @ApiBody({ type: ProjectDto })
    async createProject(@Body() projectDto: ProjectDto) {
        return this.projectService.createProject(projectDto);
    }

    @Patch(':id')
    async updateProject(
        @Param('id') id: string,
        @Body() projectDto: ProjectDto,
    ) {
        return this.projectService.updateProject(id, projectDto);
    }

    @Delete(':id')
    async deleteProject(@Param('id') id: string) {
        return this.projectService.deleteProject(id);
    }
}
