import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';
import { OBJECTID_PATTERN } from '../../shared/const/regex.const';

export class EmployeeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Employee Name',
    })
    name: string;

    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        example: '1999-11-05',
    })
    dob: Date;

    @IsString()
    @ApiProperty({
        example: 'Employee Address',
    })
    address: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456789',
    })
    id_card: string;

    @IsString()
    @ApiProperty({
        example: '0901234567',
    })
    phone_number: string;

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f32902db3f35d4abfe2d0a', '62f32942db3f35d4abfe2d0b'],
    })
    technologies: string[];

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 6,
    })
    experience: number;

    @IsString({ each: true })
    @ApiProperty({
        example: ['English', 'Japanese'],
    })
    languages: string[];

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({
        example: ['Cert 1', 'Cert 2'],
    })
    certs: string[];
}
