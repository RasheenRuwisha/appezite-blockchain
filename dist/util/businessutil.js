"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const business_1 = require("./..//business");
const appconfig_1 = require("./../appconfig");
const theme_1 = require("./../theme");
const category_1 = require("./../category");
class BusinessUtil {
    /*
    * @param
    */
    generateUserCredentialsObject(password, email, phone, businessId, status) {
        const usercredentials = {
            password,
            email,
            phone,
            businessId,
            status
        };
        return usercredentials;
    }
    generateInitialBusinessObject(email, phone, businessId, name, country) {
        const business = new business_1.Business();
        const contact = {
            email,
            phone
        };
        business.email = email;
        business.businessId = businessId;
        business.name = name;
        business.contact = contact;
        business.country = country;
        return business;
    }
    generateBusinessThemeObject(business, background, starterScreen, logo, lightColor, darkColor) {
        const appconfig = new appconfig_1.Appconfig();
        appconfig.backgroundImage = background;
        appconfig.logo = logo;
        appconfig.starterScreen = starterScreen;
        const theme = new theme_1.Theme();
        theme.dark = darkColor;
        theme.light = lightColor;
        business.appconfig = appconfig;
        business.theme = theme;
        return business;
    }
    generateBusinessCategory(businessId, categoryId, categoryName, categoryImage) {
        const category = new category_1.Category();
        category.categoryId = categoryId;
        category.name = categoryName;
        category.image = categoryImage;
        category.visibility = true;
        category.businessId = businessId;
        return category;
    }
}
exports.BusinessUtil = BusinessUtil;
//# sourceMappingURL=businessutil.js.map