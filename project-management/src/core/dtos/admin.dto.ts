import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import Status from "../enums/status.enum";

export class AdminDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Admin Name'
    })
    name: string;

    @ApiProperty({
        example: false,
    })
    status: boolean;
}