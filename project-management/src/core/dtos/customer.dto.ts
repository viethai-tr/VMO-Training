import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CustomerDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Company Name'
    })
    name: string;

    @IsString()
    @ApiProperty({
        example: 'Company Description'
    })
    description: string;
}