import { UserCredentials } from './../usercredentials';
import { Business } from './..//business';
import { Category } from './../category';
export declare class BusinessUtil {
    generateUserCredentialsObject(password: any, email: any, phone: any, businessId: any, status: any): UserCredentials;
    generateInitialBusinessObject(email: any, phone: any, businessId: any, name: any, country: any): Business;
    generateBusinessThemeObject(business: any, appconfig: any, theme: any): Business;
    generateBusinessCategory(businessId: any, categoryId: any, categoryName: any, categoryImage: any): Category;
}
