import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { OBJECTID_PATTERN } from "../../shared/const/regex.const";

export class ProjectCountDto {
    @IsOptional()
    @IsString()
    @Matches(OBJECTID_PATTERN)
    status?: string;

    @IsOptional()
    @IsString()
    @Matches(OBJECTID_PATTERN)
    type: string;

    @IsOptional()
    @IsString()
    @Matches(OBJECTID_PATTERN)
    technology: string;

    @IsOptional()
    @IsString()
    @Matches(OBJECTID_PATTERN)
    customer: string;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    @ApiProperty({
        example: '2022-08-24T00:00:00Z'
    })
    startingDate: Date;
}