import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './user.schema';
import * as argon from 'argon2';
import { request } from 'http';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async create(userDto: UserDto): Promise<User> {
        userDto.password = await argon.hash(userDto.password);
        const createdUser = new this.userModel(userDto);
        return createdUser.save();
    }

    async update(id: string, userDto: UserDto): Promise<User> {
        userDto.password = await argon.hash(userDto.password);
        return await this.userModel.findByIdAndUpdate(id, userDto).exec();
    }

    async delete(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }
}
