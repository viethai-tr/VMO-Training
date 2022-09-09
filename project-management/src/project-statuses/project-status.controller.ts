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
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import Role from '../core/enums/role.enum';
import { Roles } from '../shared/decorators/roles.decorator';
import { PaginationDto } from '../core/dtos';
import { ProjectStatusDto } from '../core/dtos/project-status.dto';
import { ProjectStatusService } from './project-status.service';
import { MongoExceptionFilter } from '../shared/filters/mongo-exception.filter';
import { API_QUERY } from '../shared/const/variables.const';
import { ParseObjectIdPipe } from '../shared/pipes/objectid.pipe';
import { Types } from 'mongoose';

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
    async getProjectStatusById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.projectStatusService.getProjectStatusById(id);
    }

    @Post()
    async createProjectStatus(@Body() projectStatusDto: ProjectStatusDto) {
        return this.projectStatusService.createProjectStatus(projectStatusDto);
    }

    @Patch(':id')
    async updateProjectStatus(
        @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
        @Body() projectStatusDto: ProjectStatusDto,
    ) {
        return this.projectStatusService.updateProjectStatus(
            id,
            projectStatusDto,
        );
    }

    @Delete(':id')
    async deleteProjectStatus(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.projectStatusService.deleteProjectStatus(id);
    }
}
