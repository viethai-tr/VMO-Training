import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('rtSecretKey'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req
            .get('authorization')
            .replace('Bearer', '')
            .trim();
        return {
            ...payload,
            refreshToken,
        };
    }
}
