import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { RedisCacheService } from 'src/caches/cache.service';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(
        private readonly reflector: Reflector,
        private jwt: JwtService,
        private config: ConfigService,
        private cache: RedisCacheService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const isPassed = await super.canActivate(context);
        if (!isPassed) throw new UnauthorizedException('Invalid token (isPassed)!');

        const request = context.switchToHttp().getRequest();
        let auth = request.get('Authorization');
        auth = auth.replace('Bearer', '').trim();
        const signature = auth.split('.').at(-1);

        let username: string;
        let sessionId: string;
        await this.jwt
            .verifyAsync(auth, {
                secret: this.config.get<string>('AT_SECRET_KEY'),
                ignoreExpiration: true,
            })
            .then((data) => {
                username = data.username;
            });

        sessionId = request.session.sessionId;
        if (!sessionId) return false; // sessionId not found, invalid

        const accessCache = await this.cache.get(
            `user:${username}:access_token:${sessionId}`,
        );

        console.log('signature: ', signature);
        console.log('auth: ', accessCache);

        if (signature != accessCache)
            throw new UnauthorizedException('Invalid token! (signature)');

        return true;
    }
}
