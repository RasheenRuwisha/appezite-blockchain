import { UserCredentials } from './../usercredentials';
import { Business } from './..//business';
import { Contact } from './../contact';
import { Appconfig } from './../appconfig';
import { Theme } from './../theme';
import { Category } from './../category';
import { Product } from './../product';
import { Addon } from '../addons';

export class BusinessUtil {

    /* 
    * @param
    */
    public generateUserCredentialsObject(password,email,phone,businessId,status):UserCredentials{
        const usercredentials: UserCredentials = {
            password,
            email,
            phone,
            businessId,
            status
        }
        return usercredentials;
    }

    public generateInitialBusinessObject(email,phone,businessId,name,country):Business{
        const business = new Business();

        const contact: Contact = {
            email,
            phone
        }

        business.email = email;
        business.businessId = businessId;
        business.name = name;
        business.contact = contact;
        business.country = country;
        return business;
    }

    public generateBusinessThemeObject(business,appconfig, theme):Business{
        business.appconfig = appconfig;
        business.theme = theme;
        return business;
    }

    public generateBusinessCategory(businessId,categoryId,categoryName,categoryImage):Category{
        const category = new Category();
        category.categoryId = categoryId;
        category.name = categoryName;
        category.image = categoryImage;
        category.visibility = true;
        category.businessId = businessId;

        return category;
    }

}
