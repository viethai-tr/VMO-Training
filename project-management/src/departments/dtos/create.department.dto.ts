import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { OBJECTID_PATTERN } from "../../shared/const/regex.const";

export class DepartmentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Department Name'
    })
    name: string;

    @IsString()
    @ApiProperty({
        example: 'Department Description'
    })
    description: string;

    @Type(() => Date)
    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({
        example: '2022-08-24'
    })
    founding_date: Date;

    @IsString()
    @IsNotEmpty()
    @Matches(OBJECTID_PATTERN)
    @ApiProperty({
        example: '62f47528059085263d64565b'
    })
    manager: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f47528059085263d64565c']
    })
    employees: string[];

    @IsArray()
    @IsString({ each: true })
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f913e2b21d0f9fe8f844aa']
    })
    projects: string[];
}