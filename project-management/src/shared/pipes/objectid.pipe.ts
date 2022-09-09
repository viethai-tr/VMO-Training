import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
    transform(value: any): Types.ObjectId {
        const validObjectId = Types.ObjectId.isValid(value);

        if (!validObjectId) {
            throw new BadRequestException('Invalid ID');
        }

        return new mongoose.Types.ObjectId(value);
    }
}