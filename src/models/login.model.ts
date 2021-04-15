import {  IsNotEmpty } from "class-validator";
import { ILogin } from "../interfaces/app.interface";


export class LoginModel implements ILogin {
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
} 