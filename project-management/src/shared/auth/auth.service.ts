import {
    ForbiddenException,
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

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async login(authDto: AuthDto) {
        const admin = await this.adminModel.findOne({
            username: authDto.username,
        });
        if (!admin)
            throw new HttpException('Admin not found', HttpStatus.BAD_REQUEST);

        const pwMatch = await argon.verify(admin.password, authDto.password);
        if (!pwMatch)
            throw new HttpException(
                'Password mismatch!',
                HttpStatus.BAD_REQUEST,
            );

        const id = admin._id.toString();
        const tokens = await this.signToken(authDto.username, id);
        await this.updateRtHash(id, tokens.refresh_token);

        return tokens;
    }

    async logout(id: string): Promise<boolean> {
        await this.adminModel.findOneAndUpdate({ _id: id }, { rt: null });
        return true;
    }

    async signToken(username: string, id: string): Promise<Tokens> {
        const payload = {
            sub: id,
            username
        };

        const [at, rt] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '15m',
                secret: this.config.get('secretKey'),
            }),

            this.jwt.signAsync(payload, {
                expiresIn: '7d',
                secret: this.config.get('rtSecretKey'),
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt
        };
    }

    async updateRtHash(id: string, rt: string) {
        const newRt = await argon.hash(rt);

        await this.adminModel.findOneAndUpdate({ _id: id }, { rt: newRt });
    }

    async refreshToken(id: string, rt: string): Promise<Tokens> {
        const user = await this.adminModel.findOne({ _id: id });

        if (!user || !user.rt) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

        const rtMatched = await argon.verify(user.rt, rt);
        if (!rtMatched) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

        const tokens = await this.signToken(user.username, user.id);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }
}
