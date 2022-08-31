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

    async getAllUsers(limit?: number, page?: number) {
        try {
            let listResult;
            page = Math.floor(page);
            const totalDocs = await this.adminModel.countDocuments({
                role: 'User',
            });
            const totalPages = Math.ceil(totalDocs / limit);
            if (limit) {
                if (page <= totalPages) {
                    const skip = limit * (page - 1);

                    listResult = await this.adminModel
                        .find({ password: 0, rt: 0 })
                        .skip(skip)
                        .limit(limit);

                    return {
                        curPage: page,
                        totalPages: totalPages,
                        listResult,
                    };
                } else if (page > totalPages) {
                    throw new HttpException(
                        `Page ${page} not exist!`,
                        HttpStatus.FORBIDDEN,
                    );
                } else {
                    listResult = await this.adminModel
                        .find({ role: 'User' }, { password: 0, rt: 0 })
                        .limit(limit);
                    return {
                        limit: limit,
                        listResult,
                    };
                }
            } else {
                listResult = await this.adminModel.find(
                    { role: 'User' },
                    { password: 0, rt: 0 },
                );
            }
            return Promise.resolve(listResult);
        } catch (err) {
            return Promise.reject(err);
        }
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
        return await this.adminModel.findOneAndUpdate({ _id: id }, adminDto);
    }

    async getAdminInfo(id: string) {
        const curAdmin = await this.adminModel.findOne({ _id: id }, {password: 0, rt: 0});

        return curAdmin;
    }
}
