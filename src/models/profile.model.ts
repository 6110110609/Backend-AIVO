import { IsNotEmpty, Matches } from "class-validator";
import { IProfile } from "../interfaces/app.interface";

export class ProfileModel implements IProfile{
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    @Matches(/^[0-9]{10,10}$/)
    telphone: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    facebook: string;

    @IsNotEmpty()
    line: string;

    image: string;

}