import { IsNotEmpty } from "class-validator";
import { IRegister, RoleAccount } from "../interfaces/app.interface";

export class RegisterModel implements IRegister {
    flagserver: string;
    firstname: string;
    lastname: string;
    telphone: string;
    email: string;
    facebook: string;
    line: string;
    id?: any;
    image?: string;
    role?: RoleAccount;
    created?: Date;
    updated?: Date;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

 
}