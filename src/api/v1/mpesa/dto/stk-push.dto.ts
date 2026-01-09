import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";


export class StkPushDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^254[0-9]{9}$/, {message: 'Phone number must follow 254XXXXXXXXX'})
    phoneNumber: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    accountReference: string; // Chama name or ID

    @IsNotEmpty()
    @IsString()
    chamaId: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    contributionDate: string;
}