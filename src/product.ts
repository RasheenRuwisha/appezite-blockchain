import { Variant } from './variant';
import { AddonGroup } from './addongroup';
import { VariantGroup } from './variantgroup';

export class Product{
    public docType: string = "Product";
    public productId: string;
    public name: string;
    public categoryId: Array<String>;
    public image: string;
    public visibility: boolean;
    public addons: Array<AddonGroup>;
    public variant: VariantGroup
    public price: number;
    public description :string;
    public businessId :string
}