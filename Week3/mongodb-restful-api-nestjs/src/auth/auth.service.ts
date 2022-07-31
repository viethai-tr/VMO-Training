import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>, 
        private jwt: JwtService,
        private config: ConfigService    
    ) {}

    async signin(dto: AuthDto) {
        const user = await this.userModel.findOne({username: dto.username});
        if (!user)
            throw new ForbiddenException('User does not exist!');

        const pwMatches = await argon.verify(user.password, dto.password);
        if (!pwMatches)
            throw new ForbiddenException('Password does not match!');
        
        return this.signToken(dto.username, user.email);
    }

    async signToken(username: string, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: username,
            email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET_KEY'),
        });

        return {
            access_token: token,
        }
    }
}
