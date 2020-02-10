import { AddonGroup } from './addongroup';
import { VariantGroup } from './variantgroup';
export declare class Product {
    docType: string;
    productId: string;
    name: string;
    categoryId: Array<String>;
    image: string;
    visibility: boolean;
    addons: Array<AddonGroup>;
    variant: VariantGroup;
    price: number;
    description: string;
    businessId: string;
}
