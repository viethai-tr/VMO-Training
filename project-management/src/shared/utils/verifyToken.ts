import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailTokenPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class VerifyEmailToken {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async verifyJwt(token: string): Promise<EmailTokenPayload> {
        return this.jwtService.verifyAsync(token, {
            secret: this.config.get<string>('EMAIL_SECRET_KEY'),
        });
    }
}
