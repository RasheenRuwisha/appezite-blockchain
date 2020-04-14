import { CartProduct } from "./cartProduct";
export declare class PurchaseOrder {
    purchaseId: string;
    businessId: string;
    customerEmail: string;
    products: Array<CartProduct>;
    docType: string;
    status: string;
    payment: string;
    orderedAt: Date;
    orderReadyBy: Date;
    deliveryType: string;
    notes: string;
    deliveryAddress: string;
    customerName: string;
    platform: string;
    total: string;
    customerNumber: string;
    deliveryCharge: number;
    notificationTokens: Array<String>;
}
