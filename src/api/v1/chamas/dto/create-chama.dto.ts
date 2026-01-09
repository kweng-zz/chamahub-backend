import { IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CreateChamaDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    contributionAmount: number;

    @IsString()
    contributionFrequency: string;
}