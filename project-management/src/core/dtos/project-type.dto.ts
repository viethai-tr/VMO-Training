import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ProjectTypeDto {
    @IsString()
    @ApiProperty({
        example: 'Project type'
    })
    name: string;

    @IsString()
    @ApiProperty()
    status: string;
}