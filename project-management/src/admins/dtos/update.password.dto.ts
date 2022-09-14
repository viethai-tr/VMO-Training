import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        type: String,
    })
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        type: String,
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        type: String,
    })
    repeatPassword: string;
}
