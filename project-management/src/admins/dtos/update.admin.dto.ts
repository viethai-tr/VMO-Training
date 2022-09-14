import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateAdminDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Admin Name'
    })
    name: string;

    @ApiProperty({
        example: false,
    })
    @IsOptional()
    status: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
    })
    avatarUrl: string;
}