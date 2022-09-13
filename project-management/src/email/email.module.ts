import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';
import { VerifyEmailToken } from '../shared/utils/verifyToken';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../core/schemas/admin.schema';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    providers: [EmailService, VerifyEmailToken],
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 465,
                    ignoreTLS: true,
                    secure: true,
                    auth: {
                        user: config.get('emailAddress'),
                        pass: config.get('emailPassword'),
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@localhost>',
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),

        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),

        JwtModule.register({}),
    ],

    exports: [EmailService],
})
export class EmailModule {}
