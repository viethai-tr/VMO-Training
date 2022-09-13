import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create.admin.dto';
import { AdminDto } from './dtos/update.admin.dto';
import { ChangePasswordDto } from './dtos/update.password.dto';
import { AdminRepository } from './admin.repository';
import * as argon from 'argon2';
import { Admin, AdminDocument } from '../core/schemas/admin.schema';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailToken } from '../shared/utils/verifyToken';
import { EmailService } from '../email/email.service';
import { ADMIN } from './admin.const';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AdminService {
    constructor(
        private adminRepository: AdminRepository,
        @InjectModel(Admin.name)
        private adminModel: SoftDeleteModel<AdminDocument>,
        private jwt: JwtService,
        private config: ConfigService,
        private verifyEmailToken: VerifyEmailToken,
        private emailService: EmailService,
        private cloudinaryService: CloudinaryService,
    ) {}

    async getAllUser(
        limit?: string,
        page?: string,
        search?: string,
        sort?: string,
    ) {
        return this.adminRepository.getAllUsers(limit, page, search, sort);
    }

    async changePassword(id: string, passwordDto: ChangePasswordDto) {
        return this.adminRepository.changePassword(id, passwordDto);
    }

    async updateAdmin(id: string, adminDto: AdminDto) {
        return this.adminRepository.updateAdmin(id, adminDto);
    }

    async getAdminInfo(id: string) {
        return this.adminRepository.getAdminInfo(id);
    }

    async createUser(
        createUserDto: CreateUserDto,
        avatar: Express.Multer.File,
    ) {
        const checkExistedEmail = await this.adminModel.find({
            email: createUserDto.email,
        });
        if (checkExistedEmail.length > 0)
            throw new BadRequestException('Email is already in use');

        createUserDto.password = await argon.hash(createUserDto.password);
        const timestamp = Date.now();
        const token = await this.signToken(createUserDto.email, timestamp);

        const avatarCloud = await this.cloudinaryService.uploadCloudinary(
            avatar,
        );
        createUserDto.avatar = avatarCloud.url;

        await this.emailService.sendActiveMail(
            token,
            createUserDto.email,
            createUserDto.username,
        );

        return this.adminRepository.create(<AdminDocument>createUserDto);
    }

    async resendEmail(email: string) {
        const user = await this.adminModel.findOne({ email: email });
        if (!user) throw new BadRequestException('Email does not exist');
        if (user.active == true)
            throw new BadRequestException('User is already activated');
        const timestamp = Date.now();
        const token = await this.signToken(email, timestamp);

        return this.emailService.sendActiveMail(token, email, user.username);
    }

    async deleteUser(id: string) {
        const checkUser = await this.adminRepository.getById(id);
        if (!checkUser) throw new NotFoundException('User not found');
        if (checkUser.role != 'User')
            throw new BadRequestException('Cannot delete');

        return this.adminModel.softDelete({ _id: id });
    }

    async restoreUser(id: string) {
        return this.adminModel.restore({ _id: id });
    }

    async findByCondition(query) {
        return this.adminRepository.findByCondition(query);
    }

    async signToken(email: string, timestamp: number) {
        const payload = {
            email,
            timestamp,
        };

        const emailToken = await this.jwt.signAsync(payload, {
            secret: this.config.get<string>('EMAIL_SECRET_KEY'),
        });

        return emailToken;
    }

    async activeUser(token: string) {
        const payload = await this.verifyEmailToken.verifyJwt(token);

        const checkUser = await this.adminModel.find({
            email: payload.email,
            active: false,
            isDeleted: false,
        });
        if (!checkUser || checkUser.length == 0) {
            throw new BadRequestException(
                'User is already activated or has been deleted',
            );
        }

        const timestamp = payload.timestamp;
        if (Date.now() - timestamp > ADMIN.ACTIVE_TIME) {
            throw new BadRequestException('This active token is expired!');
        }

        await this.adminModel.updateOne(
            { email: payload.email },
            { $set: { active: true } },
        );

        return {
            message: 'Successful activation!',
        };
    }
}
