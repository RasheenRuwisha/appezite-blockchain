import { Product } from './product';

export class Category {
    public docType : string = "Category";
    public categoryId: string;
    public businessId: string;
    public name: string;
    public image: string;
    public visibility: boolean;
}
