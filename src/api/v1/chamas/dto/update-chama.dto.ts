import { IsNumber, IsOptional, IsString, Min } from "class-validator";


export class UpdateChamaDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    contributionAmount?: number;

    @IsString()
    @IsOptional()
    contributionFrequency?: string;
}