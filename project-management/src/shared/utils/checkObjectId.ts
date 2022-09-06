import { BadRequestException } from '@nestjs/common';

export function checkObjectId(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/) || id == '' || id == null || id === undefined) {
        console.log(id);
        throw new BadRequestException('Invalid ID');
    }
    return true;
}
