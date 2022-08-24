import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AdminDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Admin Name'
    })
    name: string;

    @IsString()
    @ApiProperty({
        example: 'Active'
    })
    status: string;
}