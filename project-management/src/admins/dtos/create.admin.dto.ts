import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { USERNAME_PATTERN } from '../admin.const';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User Name',
    })
    name: string;

    @IsString()
    @Matches(USERNAME_PATTERN)
    @ApiProperty({
        example: 'username',
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
    })
    password: string;

    @IsEmail()
    @ApiProperty({
        example: 'example@example.com',
    })
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
    })
    avatarUrl: string;
}
