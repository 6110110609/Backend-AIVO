import { IsNotEmpty } from "class-validator";
import { IAddress } from "interfaces/app.interface";

export class AddressModel implements IAddress {

    @IsNotEmpty()
    // @IsLatitude()
    latitude: string;

    @IsNotEmpty()
    // @IsLongitude()
    longitude: string;

    @IsNotEmpty()
    organization: string;

    @IsNotEmpty()
    num: string;

    @IsNotEmpty()
    subdistrict: string;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    province: string;

    @IsNotEmpty()
    zipcode: string;

}