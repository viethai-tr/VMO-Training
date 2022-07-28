import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    // POST /auth/signup
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    // POST /auth/signin
    @Post('signin')
    @HttpCode(200)
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}