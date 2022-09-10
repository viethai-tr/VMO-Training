import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ProjectTypeDto {
    @IsString()
    @ApiProperty({
        example: 'Project type',
    })
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ example: true })
    status: boolean;
}
