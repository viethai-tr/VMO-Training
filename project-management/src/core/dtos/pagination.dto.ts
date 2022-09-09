import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    page?: string;

    @IsOptional()
    limit?: string;
}