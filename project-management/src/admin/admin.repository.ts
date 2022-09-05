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

    async getAllUsers(
        limit: number = 5,
        page: number = 1,
        search: string = '',
        sort: string = 'asc',
        sortBy: string = 'name',
    ) {
        let sortKind;
        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        if (limit < 0) limit = 0;

        const listResult = await this.adminModel
            .find(
                { role: 'User', name: new RegExp('.*' + search + '.*', 'i') },
                { password: 0, rt: 0 },
            )
            .sort({ [sortBy]: sortKind })
            .limit(limit);

        const totalDocs = await this.adminModel
            .find(
                { role: 'User', name: new RegExp('.*' + search + '.*', 'i') },
                { password: 0, rt: 0 },
            )
            .countDocuments();

        let totalPages;
        if (limit == 0) totalPages = 1;
        else totalPages = Math.ceil(totalDocs / limit);

        if (page > totalPages || page < 0) page = 1;

        return {
            curPage: page,
            totalPages,
            search,
            sortBy,
            sort,
            listResult,
        };
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
        return this.adminModel.findOneAndUpdate({ _id: id }, adminDto);
    }

    async getAdminInfo(id: string) {
        const curAdmin = await this.adminModel.findOne(
            { _id: id },
            { password: 0, rt: 0 },
        );

        return curAdmin;
    }
}
