import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateProjectStatusDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Status name'
    })
    name: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    status: boolean;
}