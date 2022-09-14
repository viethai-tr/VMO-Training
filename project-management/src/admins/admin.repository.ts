import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { checkInteger } from '../shared/utils/checkInteger';
import { UpdateAdminDto } from './dtos/update.admin.dto';
import { ChangePasswordDto } from './dtos/update.password.dto';
import { Repository } from '../core/Repository';
import { Admin, AdminDocument } from '../core/schemas/admin.schema';
import { RESPOND_UPDATED } from '../shared/const/respond.const';

@Injectable()
export class AdminRepository extends Repository<AdminDocument> {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    ) {
        super(adminModel);
    }

    async getAllUsers(
        limit: string = '5',
        page: string = '1',
        search: string = '',
        sort: string = 'asc',
        sortBy: string = 'name',
    ) {
        let sortKind;
        let limitNum: number;
        let pageNum: number;

        if (sort != undefined) {
            sort = sort.toLowerCase();
            if (sort == 'desc') sortKind = 'desc';
            else sortKind = 'asc';
        } else sortKind = 'asc';

        checkInteger(limit) ? (limitNum = parseInt(limit)) : (limitNum = 5);
        checkInteger(page) ? (pageNum = parseInt(page)) : (pageNum = 1);

        const listResult = await this.adminModel
            .find(
                {
                    role: 'User',
                    name: new RegExp('.*' + search + '.*', 'i'),
                    isDeleted: false,
                },
                { password: 0, rt: 0 },
            )
            .sort({ [sortBy]: sortKind })
            .limit(limitNum);

        const totalDocs = await this.adminModel
            .find(
                {
                    role: 'User',
                    name: new RegExp('.*' + search + '.*', 'i'),
                    isDeleted: false,
                },
                { password: 0, rt: 0 },
            )
            .countDocuments();

        let totalPages = Math.ceil(totalDocs / limitNum);

        return {
            totalDocs,
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
            throw new BadRequestException(
                'Password and confirm password does not match!',
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
            await this.adminModel.updateOne(
                { _id: id },
                { $set: { password: newPasswordHashed } },
            );
            return RESPOND_UPDATED;
        } else {
            throw new ForbiddenException(
                'Password does not match old password!',
            );
        }
    }

    async getAdminInfo(id: string) {
        return this.adminModel.findOne({ _id: id }, { password: 0, rt: 0 });
    }

    async findByCondition(query) {
        return this.adminModel.find(query);
    }

    async updatePassword(username: string, password: string) {
        return this.adminModel.updateOne(
            { username: username },
            { $set: { password: password, verifyCode: null } },
        );
    }
}
