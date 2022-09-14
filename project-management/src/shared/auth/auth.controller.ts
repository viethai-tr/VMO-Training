import { Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../core/dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../../core/schemas/admin.schema';
import { Model } from 'mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { GetCurrentAdmin } from '../decorators/get-current-admin.decorator';
import { RtGuard } from './guards/rt.guard';

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
    // async testAdmin(@GetCurrentAdmin() user) {
    //     return user;
    // }

    @Post('logout')
    async logout(@GetCurrentAdmin('sub') id: string) {
        return await this.authService.logout(id);
    }

    @Post('refresh')
    @Public()
    @UseGuards(RtGuard)
    async refreshToken(@GetCurrentAdmin('sub') id: string, @GetCurrentAdmin('refreshToken') rt: string) {
        return await this.authService.refreshToken(id, rt);
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Get('test')
    // getInfo(@Req() req: Request) {
    //     const admin = req.user;
    //     if (admin)
    //         return this.authService.getEmployees();
    // }
}
