import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProjectStatusDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Status name'
    })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    status: string;
}