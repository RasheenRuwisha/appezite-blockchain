import { Context, Contract } from 'fabric-contract-api';
export declare class BusinessContract extends Contract {
    private businessUtil;
    createBusiness(ctx: Context, businessId: string, name: string, email: string, country: string, password: string, phone: string): Promise<void>;
    queryAllBusinesses(ctx: Context): Promise<string>;
    queryUser(ctx: Context, username: string): Promise<string>;
    queryBusiness(ctx: Context, businessNumber: string): Promise<string>;
    updateBusinessTheme(ctx: Context, businessNumber: string, background: string, logo: string, starterScreen: string, darkColor: string, lightColor: string): Promise<void>;
    updateBusiness(ctx: Context, businessId: string, email: string, businessDetails: string): Promise<string>;
    updatePickupHours(ctx: Context, businessId: string, openHours: any): Promise<string>;
    updatePreparationTime(ctx: Context, businessId: string, preparationTime: string): Promise<string>;
    updateDeliveryStatus(ctx: Context, businessId: string): Promise<string>;
    addCategories(ctx: Context, businessNumber: string, categoryNumber: string, categoryName: string, categoryImage: string): Promise<void>;
    getCategories(ctx: Context, categoryNumber: string): Promise<string>;
    updateCategory(ctx: Context, businessNumber: string, categoryNumber: string, image: string, name: string): Promise<string>;
    queryAllCategories(ctx: Context, businessNumber: string): Promise<string>;
    addProduct(ctx: Context, businessNumber: string, product: string): Promise<string>;
    queryAllProducts(ctx: Context, businessNumber: string): Promise<string>;
    queryAllCategoryProducts(ctx: Context, businessNumber: string, categoryId: string): Promise<string>;
    getProduct(ctx: Context, productNumber: string): Promise<string>;
    removeProduct(ctx: Context, productNumber: string, businessNumber: string): Promise<void>;
    updateProduct(ctx: Context, businessNumber: string, product: string): Promise<string>;
    createBusinessUser(ctx: Context, businessUser: string): Promise<string>;
    getBusinessUser(ctx: Context, businessUser: string): Promise<string>;
    createBusinessUserCart(ctx: Context, cart: string): Promise<string>;
    getBusinessUserCart(ctx: Context, businessUser: string): Promise<string>;
    createBusinessUserOrder(ctx: Context, order: string): Promise<string>;
    getBusinessOrder(ctx: Context, businessId: string, startDate: string, endDate: string, status: any): Promise<string>;
    getCustomerOrder(ctx: Context, businessId: string, email: string): Promise<string>;
    updateOrderStatus(ctx: Context, businessId: string, status: string, orderId: string): Promise<string>;
    addApkURL(ctx: Context, businessId: string, apkURL: string): Promise<string>;
}