import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class ResettingPasswordDto {
    @IsString()
    @IsNotEmpty()
    @Length(6)
    username: string;

    @IsNumberString()
    @IsNotEmpty()
    @Length(6, 6)
    @ApiProperty({
        example: '000000',
    })
    verifyCode: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        example: 'newpassword',
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        example: 'confirmpassword',
    })
    confirmPassword: string;
}
