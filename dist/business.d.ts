import { Theme } from './theme';
import { Address } from './address';
import { Appconfig } from './appconfig';
import { Contact } from './contact';
import { Keyvalue } from './keyvalue';
import { OpenHours } from './openhours';
import { DeliveryLocation } from './deliveryLocation';
export declare class Business {
    docType: string;
    businessNumber: string;
    businessId: string;
    merchantId: string;
    name: string;
    email: string;
    country: string;
    currency: string;
    createdDate: string;
    type: string;
    status: string;
    theme: Theme;
    address: Address;
    description: string;
    appconfig: Appconfig;
    contact: Contact;
    orderPreparationTime: number;
    orderAheadConfigs: Array<Keyvalue>;
    pickUpHours: Array<OpenHours>;
    deliveryHours: Array<OpenHours>;
    deliveryEnabled: boolean;
    pickUpEnabled: boolean;
    deliveryLocation: Array<DeliveryLocation>;
    apkUrl: string;
    paypalSecret: string;
    businessImages: Array<String>;
    notificationToken: Array<String>;
    notifications: Array<String>;
    businessNotification: Array<String>;
    appId: string;
}
