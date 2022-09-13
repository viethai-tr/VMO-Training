import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AdminDto {
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
}