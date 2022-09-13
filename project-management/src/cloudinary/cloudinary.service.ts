import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor(private config: ConfigService) {}

    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        if (!file.mimetype.includes('image')) {
            console.log(file.mimetype);
            throw new BadRequestException('File type is not allowed');
        }

        return new Promise((resolve, reject) => {
            const uploadCloud = v2.uploader.upload_stream(
                {
                    folder: `${this.config.get<string>('UPLOAD_FOLDER')}`,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            Readable.from(file.buffer).pipe(uploadCloud);
        });
    }

    async uploadCloudinary(file: Express.Multer.File) {
        return this.uploadImage(file).catch(() => {
            console.log(file.mimetype);
            throw new BadRequestException('Failed to upload image');
        });
    }
}
