import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { AdminDto } from '../core/dtos/admin.dto';
import { ChangePasswordDto } from '../core/dtos/change-password.dto';
import { Repository } from '../core/Repository';
import { Admin, AdminDocument } from '../core/schemas/admin.schema';

@Injectable()
export class AdminRepository extends Repository<AdminDocument> {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    ) {
        super(adminModel);
    }

    async changePassword(id: string, passwordDto: ChangePasswordDto) {
        if (passwordDto.newPassword != passwordDto.repeatPassword) {
            throw new HttpException(
                'Password and confirm password does not match!',
                HttpStatus.BAD_REQUEST,
            );
        }
        const curPassword = await (
            await this.adminModel.findOne({ _id: id })
        ).password;
        const oldPwMatch = await argon.verify(
            curPassword,
            passwordDto.oldPassword,
        );

        if (oldPwMatch) {
            const newPasswordHashed = await argon.hash(passwordDto.newPassword);
            await this.adminModel.findOneAndUpdate(
                { _id: id },
                { password: newPasswordHashed },
            );
            return {
                HttpStatus: HttpStatus.OK,
                msg: 'Password changed',
            };
        } else {
            throw new HttpException(
                'Password does not match old password!',
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async updateAdmin(id: string, adminDto: AdminDto) {
        await this.adminModel.findOneAndUpdate({ _id: id }, adminDto);
        return {
            HttpStatus: HttpStatus.OK,
            msg: 'Admin updated!',
        };
    }

    async getAdminInfo(id: string) {
        const curAdmin = await this.adminModel.findOne({ _id: id }, {_id: 0, password: 0, rt: 0});
        delete curAdmin.password;

        return curAdmin;
    }
}
