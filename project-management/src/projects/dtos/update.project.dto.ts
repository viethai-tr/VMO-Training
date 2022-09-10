import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length, Matches, ValidateNested } from 'class-validator';
import { OBJECTID_PATTERN } from '../../shared/const/regex.const';

export class UpdateProjectDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Project Name',
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Project Description',
    })
    description: string;

    @IsString()
    @IsOptional()
    @Matches(OBJECTID_PATTERN)
    @ApiProperty({
        example: '62f4da3a39f8e1259dcdaf6b',
    })
    type: string;

    @IsString()
    @IsOptional()
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: '62f46795059085263d6455ba',
    })
    status: string;

    @IsString({ each: true })
    @IsOptional()
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f32902db3f35d4abfe2d0a', '62f32942db3f35d4abfe2d0b'],
    })
    technologies: string[];

    @IsString({ each: true })
    @IsOptional()
    @Matches(OBJECTID_PATTERN, {each: true})
    @ApiProperty({
        example: ['62f47528059085263d64565c', '62f47528059085263d64565d'],
    })
    employees: string[];

    @IsString()
    @IsOptional()
    @Matches(OBJECTID_PATTERN)
    @ApiProperty({
        example: '62f470f9059085263d64560e',
    })
    customer: string;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    @ApiProperty({
        example: '2022-08-24',
    })
    starting_date: Date;
}
