import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCustomerDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Company Name'
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Company Description'
    })
    description: string;
}