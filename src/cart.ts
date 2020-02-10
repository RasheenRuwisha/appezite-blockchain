import { CartProduct } from "./cartProduct";

export class Cart{
    public cartId : string;
    public businessId: string;
    public customerEmail: string;
    public products: Array<CartProduct>;
    public docType: string;
}

