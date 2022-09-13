import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'User Name',
    })
    name: string;

    @IsString()
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
        example: 'avatar_link',
    })
    avatar: string;
}
