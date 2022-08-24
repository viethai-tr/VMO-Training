import { IsOptional, IsString } from "class-validator";

export class ProjectCountDto {
    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    technology: string;

    @IsOptional()
    @IsString()
    customer: string;

    @IsOptional()
    @IsString()
    startingDate: string;
}