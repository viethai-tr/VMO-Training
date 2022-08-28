import { Body, Controller, Post, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../core/dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../../core/schemas/admin.schema';
import { Model } from 'mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { GetCurrentAdmin } from '../decorators/get-current-admin.decorator';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    ) { }

    @Post('signin')
    @Public()
    async signin(@Body() authDto: AuthDto) {
        return await this.authService.signin(authDto);
    }

    @Post('logout')
    async logout(@GetCurrentAdmin('id') id: string) {
        return await this.authService.logout(id);
    }

    @Post('refresh')
    async refreshToken(@GetCurrentAdmin('id') id: string, @GetCurrentAdmin('rt') rt: string) {
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
