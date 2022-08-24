import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Username of admin",
        example: 'vh-admin',
        type: String
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String
    })
    password: string;

}