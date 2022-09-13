import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { OBJECTID_PATTERN } from '../../shared/const/regex.const';

export class CountEmployeesDto {
    @IsString()
    @IsOptional()
    @Matches(OBJECTID_PATTERN)
    @ApiProperty({
        example: '62f32942db3f35d4abfe2d0b',
    })
    technology: string;

    @IsString()
    @IsOptional()
    @Matches(OBJECTID_PATTERN)
    @ApiProperty({
        example: '62f913e2b21d0f9fe8f844aa',
    })
    project: string;
}
