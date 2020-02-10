import { Theme } from './theme';
import { Address } from './address';
import { Appconfig } from './appconfig';
import { Contact } from './contact';
import { Keyvalue } from './keyvalue';
import { Category } from './category';
import { Product } from './product';
import { OpenHours } from './openhours';
import { DeliveryLocation } from './deliveryLocation';

export class Business {
    public docType : string = "Business";
    public businessNumber: string;
    public businessId: string;
    public merchantId: string;
    public name: string;
    public email: string;
    public country: string;
    public currency: string;
    public createdDate: string;
    public type: string;
    public status: string;
    public theme: Theme;
    public address: Address;
    public description: string;
    public appconfig: Appconfig;
    public contact: Contact;
    public orderPreparationTime: string;
    public orderAheadConfigs: Array<Keyvalue>;
    public pickUpHours:Array<OpenHours>;
    public deliveryHours:Array<OpenHours>;
    public deliveryEnabled: boolean;
    public pickUpEnabled: boolean;
    public deliveryLocation : Array<DeliveryLocation>;
    public apkUrl: string;
    public paypalSecret: string;
}
