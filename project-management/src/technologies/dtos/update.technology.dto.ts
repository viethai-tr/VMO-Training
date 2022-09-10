import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTechnologyDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Technology Name'
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: true
    })
    status: boolean;
}