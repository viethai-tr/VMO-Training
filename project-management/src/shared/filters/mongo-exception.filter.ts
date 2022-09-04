import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        switch (exception.code) {
            case 11000:
                const keyRegex = exception.message.match(/.*\{ (.*)\:.*\}/);
                let key = keyRegex[1];
                key = key.charAt(0).toUpperCase() + key.slice(1);
                key.replace('_', " ");

                response.status(409).json({
                    statusCode: 409,
                    message: `${key} already exists!`
                });

                break;
        }
    }
}
