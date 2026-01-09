import { IsOptional, IsString } from "class-validator";


export class UpdateMemberDto {
    @IsString()
    @IsOptional()
    role?: string;

    @IsString()
    @IsOptional()
    status?: string;
}