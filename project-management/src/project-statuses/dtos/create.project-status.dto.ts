import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ProjectStatusDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Status name'
    })
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    status: boolean;
}