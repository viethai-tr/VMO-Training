import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsNumber, IsString, Length, Matches, IsDateString, IsDate } from 'class-validator';
import { OBJECTID_PATTERN } from '../../shared/const/regex.const';

export class UpdateEmployeeDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Employee Name',
    })
    name: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        example: '1999-11-05',
    })
    dob: Date;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Employee Address',
    })
    address: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '123456789',
    })
    id_card: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: '0901234567',
    })
    phone_number: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f32902db3f35d4abfe2d0a', '62f32942db3f35d4abfe2d0b'],
    })
    technologies: string[];

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 6,
    })
    experience: number;

    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({
        example: ['English', 'Japanese'],
    })
    languages: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({
        example: ['Cert 1', 'Cert 2'],
    })
    certs: string[];
}
