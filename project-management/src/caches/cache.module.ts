import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheConfig } from './cache.config';
import { RedisCacheService } from './cache.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            useClass: RedisCacheConfig,
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService]
})
export class RedisCacheModule {}
