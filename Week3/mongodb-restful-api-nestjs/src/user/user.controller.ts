import { Body, Controller, Delete, Get, Param, Post, Req, Put, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) {}

    @Get()
    async index() {
        return await this.service.findAll();
    }

    @Post()
    async create(@Body() userDto: UserDto) {
        return await this.service.create(userDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMyInfo(@Req() req: Request) {
        return req.user;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userDto: UserDto) {
        return await this.service.update(id, userDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
