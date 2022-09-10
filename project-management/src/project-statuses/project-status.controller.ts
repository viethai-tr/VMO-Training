import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto } from '../core/dtos';
import { ProjectStatusDto } from './dtos/create.project-status.dto';
import { ProjectStatusService } from './project-status.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { ParseObjectIdPipe } from '../shared/pipes/objectid.pipe';
import { UpdateProjectStatusDto } from './dtos/update.project-status.dto';

@ApiBearerAuth()
@ApiTags('Project Status')
@Roles(Role.Admin)
@UseFilters(MongoExceptionFilter)
@Controller('statuses')
export class ProjectStatusController {
    constructor(private readonly projectStatusService: ProjectStatusService) {}

    @Roles(Role.Admin, Role.User)
    @Get()
    @ApiQuery(API_QUERY.SEARCH)
    @ApiQuery(API_QUERY.LIMIT)
    @ApiQuery(API_QUERY.PAGE)
    @ApiQuery(API_QUERY.SORT)
    async getAllProjectStatuses(
        @Query() { limit, page }: PaginationDto,
        @Query() { search, sort },
    ) {
        return this.projectStatusService.getAllProjectStatuses(
            limit,
            page,
            search,
            sort,
        );
    }

    @Roles(Role.Admin, Role.User)
    @Get(':id')
    async getProjectStatusById(@Param('id', ParseObjectIdPipe) id: string) {
        return this.projectStatusService.getProjectStatusById(id);
    }

    @Post()
    @HttpCode(201)
    async createProjectStatus(@Body() projectStatusDto: ProjectStatusDto) {
        return this.projectStatusService.createProjectStatus(projectStatusDto);
    }

    @Patch(':id')
    async updateProjectStatus(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateProjectStatusDto: UpdateProjectStatusDto,
    ) {
        return this.projectStatusService.updateProjectStatus(
            id,
            updateProjectStatusDto,
        );
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteProjectStatus(@Param('id', ParseObjectIdPipe) id: string) {
        return this.projectStatusService.deleteProjectStatus(id);
    }

    @Post('restore/:id')
    async restoreProjectStatus(@Param('id', ParseObjectIdPipe) id: string) {
        return this.projectStatusService.restoreProjectStatus(id);
    }
}
