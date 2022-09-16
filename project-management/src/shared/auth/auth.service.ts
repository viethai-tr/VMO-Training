import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../../core/schemas/admin.schema';
import { AuthDto } from '../../core/dtos/auth.dto';
import * as argon from 'argon2';
import { Tokens } from './types/tokens.type';
import { RedisCacheService } from 'src/caches/cache.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
        private jwt: JwtService,
        private config: ConfigService,
        private cacheService: RedisCacheService,
    ) {}

    async login(authDto: AuthDto, session: any) {
        const admin = await this.adminModel.findOne({
            username: authDto.username,
            isDeleted: false,
        });
        if (!admin)
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST);

        const pwMatch = await argon.verify(admin.password, authDto.password);
        if (!pwMatch)
            throw new HttpException(
                'Password mismatch!',
                HttpStatus.BAD_REQUEST,
            );

        if (!admin.active)
            throw new BadRequestException(
                'Account is not active. Please check your email',
            );

        await this.adminModel.findOneAndUpdate(
            { username: authDto.username, isDeleted: false },
            { status: true },
        );

        const id = admin._id.toString();
        const tokens = await this.signToken(authDto.username, id, admin.role);
        await this.updateRtHash(id, tokens.refresh_token);

        if (!session.sessionId) {
            session.sessionId =
                Math.floor(Math.random() * 1000) + '' + Number(new Date());
        }

        const accessCacheArray = tokens.access_token.split('.');
        const accessCache = accessCacheArray[accessCacheArray.length - 1];

        const accessTTL = this.config.get<number>('ACCESS_TTL');
        const refreshTTL = this.config.get<number>('REFRESH_TTL');

        await this.cacheService.set(
            `user:${authDto.username}:access_token:${session.sessionId}`,
            accessCache,
            accessTTL,
        );

        const accessTokenCache = await this.cacheService.get(
            `user:${authDto.username}:access_token:${session.sessionId}`,
        );
        const refreshKey = `user:${authDto.username}:refresh_token`;
        let refreshTokenCache = await this.cacheService.get(refreshKey);
        if (!refreshTokenCache) {
            refreshTokenCache = tokens.refresh_token;
            await this.cacheService.set(
                refreshKey,
                refreshTokenCache,
                refreshTTL,
            );
        }

        return tokens;
    }

    async logout(username: string, session: any): Promise<boolean> {
        await this.cacheService.delete(
            `user:${username}:access_token:${session.sessionId}`,
        );

        await this.adminModel.findOneAndUpdate(
            { username: username },
            { rt: null, status: false },
        );
        return true;
    }

    async signToken(
        username: string,
        id: string,
        role: string,
    ): Promise<Tokens> {
        const payload = {
            sub: id,
            username,
            role,
        };

        const [at, rt] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '15m',
                secret: this.config.get<string>('AT_SECRET_KEY'),
            }),

            this.jwt.signAsync(payload, {
                expiresIn: '7d',
                secret: this.config.get<string>('RT_SECRET_KEY'),
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async updateRtHash(id: string, rt: string) {
        const newRt = await argon.hash(rt);

        await this.adminModel.findOneAndUpdate({ _id: id }, { rt: newRt });
    }

    async refreshToken(id: string, rt: string): Promise<Tokens> {
        const user = await this.adminModel.findOne({ _id: id });
        if (!user || !user.rt)
            throw new HttpException('Not logged in', HttpStatus.FORBIDDEN);

        const rtMatched = await argon.verify(user.rt, rt);
        if (!rtMatched)
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

        const tokens = await this.signToken(user.username, user.id, user.role);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }
}
