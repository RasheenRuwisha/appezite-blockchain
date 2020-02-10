import { CartAddons } from "./cartAddons";

export class CartProduct{
    public name: string;
    public image: string;
    public quantity: number;
    public price: number;
    public addons: Array<CartAddons>;
    public variant: string;
    public variantPrice: number;
}

