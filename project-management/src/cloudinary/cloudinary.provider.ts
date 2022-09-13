import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';

export const CloudinaryProvider = {
    provide: 'Cloudinary',
    useFactory: (): ConfigOptions => {
        return v2.config({
            cloud_name: new ConfigService().get<string>('CLOUD_NAME'),
            api_key: new ConfigService().get<string>('CLOUD_API_KEY'),
            api_secret: new ConfigService().get<string>('CLOUD_API_SECRET'),
        });
    },
};
