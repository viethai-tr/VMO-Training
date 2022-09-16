import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async get(key: string): Promise<string> {
        return this.cacheManager.get(key);
    }

    async set(key: string, value: string, ttl: number): Promise<any> {
        return this.cacheManager.set(key, value, {ttl});
    }

    async delete(key: string): Promise<void> {
        this.cacheManager.del(key);
    }

}
