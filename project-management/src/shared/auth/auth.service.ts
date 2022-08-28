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

    async signin(authDto: AuthDto) {
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
        return this.signToken(authDto.username, id);
    }

    async signToken(
        username: string,
        id: string,
    ): Promise<Tokens> {
        const payload = {
            sub: id,
            username,
        };

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('SECRET_KEY'),
        });
        
        // Fix here
        return 
    }
}
