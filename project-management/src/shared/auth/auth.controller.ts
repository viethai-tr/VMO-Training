import { Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../core/dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../../core/schemas/admin.schema';
import { Model } from 'mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { GetCurrentAdmin } from '../decorators/get-current-admin.decorator';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,

        // private config: ConfigService
    ) { }

    @Post('login')
    @Public()
    async login(@Body() authDto: AuthDto) {
        return await this.authService.login(authDto);
    }

    // @Public()
    // @Get('admin')
    // async testAdmin() {
    //     return this.config.get('AT_SECRET_KEY');
    // }

    @Post('logout')
    async logout(@GetCurrentAdmin('sub') id: string) {
        return await this.authService.logout(id);
    }

    @Post('refresh')
    async refreshToken(@GetCurrentAdmin('sub') id: string, @GetCurrentAdmin('rt') rt: string) {
        // continue here
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Get('test')
    // getInfo(@Req() req: Request) {
    //     const admin = req.user;
    //     if (admin)
    //         return this.authService.getEmployees();
    // }
}
