import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateProjectTypeDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Project type'
    })
    name: string;
    
    @IsOptional()
    @IsBoolean()
    @ApiProperty({
        example: true
    })
    status: boolean;
}