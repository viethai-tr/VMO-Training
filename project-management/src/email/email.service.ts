import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(
        private config: ConfigService,
        private mailerService: MailerService,
    ) {}

    async sendActiveMail(token: string, email: string, name: string) {
        const port = this.config.get<number>('PORT');
        const url = `http://localhost:${port}/api/v1/admins/active?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to PM Project! Active your account',
            template: './activation',
            context: {
                name,
                url,
            },
        });
    }

    async sendForgotPasswordMail(name: string, email: string, code: string) {
        return this.mailerService.sendMail({
            to: email,
            subject: 'PM - Password Resetting',
            template: './forgot-password',
            context: {
                name,
                code,
            },
        });
    }
}
