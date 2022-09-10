import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { OBJECTID_PATTERN } from "../../shared/const/regex.const";

export class UpdateDepartmentDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Department Name'
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Department Description'
    })
    description: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        example: '2022-08-24'
    })
    founding_date: Date[];

    @IsString()
    @IsOptional()
    @Matches(OBJECTID_PATTERN)
    @ApiProperty({
        example: '62f47528059085263d64565b'
    })
    manager: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f47528059085263d64565c']
    })
    employees: string[];

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f913e2b21d0f9fe8f844aa']
    })
    projects: string[];
}