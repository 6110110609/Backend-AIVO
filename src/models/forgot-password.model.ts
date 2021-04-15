import { IsNotEmpty } from "class-validator";
import { IForgot } from "../interfaces/app.interface";

export class ForgotModel implements IForgot{

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    macaddress: string;

    @IsNotEmpty()
    newpassword: string;

    @IsNotEmpty()
    cpassword: string;

}