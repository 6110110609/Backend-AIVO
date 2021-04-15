import { IsNotEmpty } from "class-validator";
import { IProfile } from "interfaces/app.interface";

export class AdminProfileModel implements IProfile {

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    
    telphone: string;

    email: string;

    
    facebook: string;
    line: string;
    image: string;
    
}