import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TechnologyDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Technology Name'
    })
    name: string;

    @IsString()
    @ApiProperty({
        example: 'Working'
    })
    status: string;
}