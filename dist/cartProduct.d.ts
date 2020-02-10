import { CartAddons } from "./cartAddons";
export declare class CartProduct {
    name: string;
    image: string;
    quantity: number;
    price: number;
    addons: Array<CartAddons>;
    variant: string;
    variantPrice: number;
}
