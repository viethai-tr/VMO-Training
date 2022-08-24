import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

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
    @ApiProperty({
        example: '2022-08-24'
    })
    founding_date: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '62f47528059085263d64565b'
    })
    manager: string;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    @ApiProperty({
        example: ['62f47528059085263d64565c']
    })
    employees: string[];

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({
        example: ['62f913e2b21d0f9fe8f844aa']
    })
    projects: string[];
}