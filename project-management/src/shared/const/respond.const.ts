import { HttpStatus } from '@nestjs/common';

export function RESPOND(respond, data) {
    return {
        respond,
        data,
    };
}

export const RESPOND_DELETED = {
    statusCode: HttpStatus.NO_CONTENT,
    message: 'Deleted successfully',
};

export const RESPOND_CREATED = {
    statusCode: HttpStatus.CREATED,
    message: 'Created successfully',
};

export const RESPOND_UPDATED = {
    statusCode: HttpStatus.OK,
    message: 'Updated successfully',
};

export const RESPOND_GOT = {
    statusCode: HttpStatus.OK,
    message: 'Got successfully',
};
