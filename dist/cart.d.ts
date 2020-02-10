import { CartProduct } from "./cartProduct";
export declare class Cart {
    cartId: string;
    businessId: string;
    customerEmail: string;
    products: Array<CartProduct>;
    docType: string;
}
