import { Body, Controller, Post, Session, UseGuards} from '@nestjs/common';
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
    ) { }

    @Post('login')
    @Public()
    async login(@Body() authDto: AuthDto, @Session() session: any) {
        return this.authService.login(authDto, session);
    }

    @Post('logout')
    async logout(@GetCurrentAdmin('username') username: string, @Session() session: any) {
        return this.authService.logout(username, session);
    }

    @Post('refresh')
    @Public()
    @UseGuards(RtGuard)
    async refreshToken(@GetCurrentAdmin('sub') id: string, @GetCurrentAdmin('refreshToken') rt: string) {
        return this.authService.refreshToken(id, rt);
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Get('test')
    // getInfo(@Req() req: Request) {
    //     const admin = req.user;
    //     if (admin)
    //         return this.authService.getEmployees();
    // }
}
