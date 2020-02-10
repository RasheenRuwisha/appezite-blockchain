import { CartProduct } from "./cartProduct";

export class PurchaseOrder{
    public purchaseId : string;
    public businessId: string;
    public customerEmail: string;
    public products: Array<CartProduct>;
    public docType: string;
    public status:string;
    public payment:string;
    public orderedAt:Date;
    public orderReadyBy:Date;
    public deliveryType:string;
    public notes:string;
    public deliveryAddress:string;
    public customerName:string;
    public platform:string;
}

