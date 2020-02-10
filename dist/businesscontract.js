"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const businessutil_1 = require("./util/businessutil");
const businessuser_1 = require("./businessuser");
class BusinessContract extends fabric_contract_api_1.Contract {
    constructor() {
        super(...arguments);
        this.businessUtil = new businessutil_1.BusinessUtil();
        // public async addAddons(ctx: Context,addonNumber:string, productNumber:
        // string, addonName: string, addonPrice: string){ console.info('=============
        // START : Add Product Addon ==========='); const productAsBytes = await
        // ctx.stub.getState(productNumber);     if (!productAsBytes ||
        // productAsBytes.length === 0) {         throw new Error(`${productNumber} does
        // not exist`);     }     const product : Product =
        // JSON.parse(productAsBytes.toString());     const addon: Addon =
        // this.businessUtil.generateAddons(addonNumber,addonName,addonPrice);
        // product.addons.push(addon);     await ctx.stub.putState(productNumber,
        // Buffer.from(JSON.stringify(product)));     await
        // ctx.stub.putState(addonNumber,Buffer.from(JSON.stringify(addon)));
        // console.info('============= END : Add Product Addon ==========='); }
    }
    async createBusiness(ctx, businessId, name, email, country, password, phone) {
        console.info('============= START : Create Business ===========');
        const usercredentials = this
            .businessUtil
            .generateUserCredentialsObject(password, email, password, businessId, "appconfig");
        const business = this
            .businessUtil
            .generateInitialBusinessObject(email, phone, businessId, name, country);
        await ctx
            .stub
            .putState(email, Buffer.from(JSON.stringify(usercredentials)));
        await ctx
            .stub
            .putState(businessId, Buffer.from(JSON.stringify(business)));
        console.info('============= END : Create Business ===========');
    }
    async queryAllBusinesses(ctx) {
        const query = {
            "selector": {
                "docType": {
                    "$in": ["Business"]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    async queryUser(ctx, username) {
        const userAsBytes = await ctx
            .stub
            .getState(username);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${username} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }
    async queryBusiness(ctx, businessNumber) {
        const businessAsBytes = await ctx
            .stub
            .getState(businessNumber);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessNumber} does not exist`);
        }
        console.info('============= START : String ===========');
        console.log(businessAsBytes.toString());
        console.info('============= START : Object ===========');
        console.log(businessAsBytes);
        return businessAsBytes.toString();
    }
    async updateBusinessTheme(ctx, businessNumber, background, logo, starterScreen, darkColor, lightColor) {
        console.info('============= START : updateBusinessTheme ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessNumber);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        const updatedBusiness = this
            .businessUtil
            .generateBusinessThemeObject(business, background, starterScreen, logo, lightColor, darkColor);
        await ctx
            .stub
            .putState(businessNumber, Buffer.from(JSON.stringify(updatedBusiness)));
        console.info('============= END : updateBusinessTheme ===========');
    }
    async updateBusiness(ctx, businessId, email, businessDetails) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        const userAsBytes = await ctx
            .stub
            .getState(email);
        const user = JSON.parse(userAsBytes.toString());
        user.status = "appconfiged";
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        await ctx
            .stub
            .putState(email, Buffer.from((JSON.stringify(user))));
        await ctx
            .stub
            .putState(businessId, Buffer.from((businessDetails)));
        return businessDetails;
        console.info('============= END : Update Business ===========');
    }
    async updatePickupHours(ctx, businessId, openHours) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        business.pickUpHours = openHours;
        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }
    async updatePreparationTime(ctx, businessId, preparationTime) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        business.orderPreparationTime = preparationTime;
        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }
    async updateDeliveryStatus(ctx, businessId) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        business.deliveryEnabled = !business.deliveryEnabled;
        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }
    async addCategories(ctx, businessNumber, categoryNumber, categoryName, categoryImage) {
        console.info('============= START : Create Business Category ===========');
        const category = this
            .businessUtil
            .generateBusinessCategory(businessNumber, categoryNumber, categoryName, categoryImage);
        await ctx
            .stub
            .putState(categoryNumber, Buffer.from(JSON.stringify(category)));
        console.info('============= END : Create Business Category ===========');
    }
    async getCategories(ctx, categoryNumber) {
        console.info('============= START : Get Business Category ===========');
        const categoryAsBytes = await ctx
            .stub
            .getState(categoryNumber);
        if (!categoryAsBytes || categoryAsBytes.length === 0) {
            throw new Error(`${categoryNumber} does not exist`);
        }
        console.log(categoryAsBytes.toString());
        console.info('============= END : Get Business Category ===========');
        return categoryAsBytes.toString();
    }
    async updateCategory(ctx, businessNumber, categoryNumber, image, name) {
        console.info('============= START : Get Business Category ===========');
        const categoryAsBytes = await ctx
            .stub
            .getState(categoryNumber);
        if (!categoryAsBytes || categoryAsBytes.length === 0) {
            throw new Error(`${categoryNumber} does not exist`);
        }
        const category = JSON.parse(categoryAsBytes.toString());
        category.image = image;
        category.name = name;
        await ctx
            .stub
            .putState(categoryNumber, Buffer.from(JSON.stringify(category)));
        console.info('============= END : Get Business Category ===========');
        return categoryAsBytes.toString();
    }
    async queryAllCategories(ctx, businessNumber) {
        const query = {
            "selector": {
                "docType": {
                    "$in": ["Category"]
                },
                "businessId": {
                    "$in": [businessNumber]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    async addProduct(ctx, businessNumber, product) {
        const productDetails = JSON.parse(product);
        console.info('============= START : Get Product Category ===========');
        await ctx
            .stub
            .putState(productDetails.productId, Buffer.from(JSON.stringify(productDetails)));
        console.info('============= END : Get Product Category ===========');
        return productDetails.toString();
    }
    async queryAllProducts(ctx, businessNumber) {
        const query = {
            "selector": {
                "docType": {
                    "$in": ["Product"]
                },
                "businessId": {
                    "$in": [businessNumber]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    async queryAllCategoryProducts(ctx, businessNumber, categoryId) {
        const query = {
            "selector": {
                "docType": {
                    "$in": ["Product"]
                },
                "businessId": {
                    "$in": [businessNumber]
                },
                "categoryId": {
                    "$in": [categoryId]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
    async getProduct(ctx, productNumber) {
        console.info('============= START : Get Business Product ===========');
        const productAsBytes = await ctx
            .stub
            .getState(productNumber);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productNumber} does not exist`);
        }
        console.log(productAsBytes.toString());
        console.info('============= END : Get Business Product ===========');
        return productAsBytes.toString();
    }
    async removeProduct(ctx, productNumber, businessNumber) {
        console.info('============= START : Get Business Product ===========');
        await ctx
            .stub
            .deleteState(productNumber);
        console.info('============= END : Get Business Product ===========');
    }
    async updateProduct(ctx, businessNumber, product) {
        const productDetails = JSON.parse(product);
        console.info('============= START : Get Product Category ===========');
        await ctx
            .stub
            .putState(productDetails.productId, Buffer.from(JSON.stringify(productDetails)));
        console.info('============= END : Get Product Category ===========');
        return productDetails.toString();
    }
    async createBusinessUser(ctx, businessUser) {
        console.info('============= START : Create Business ===========');
        const userDetails = JSON.parse(businessUser);
        const query = {
            "selector": {
                "docType": {
                    "$in": ["BusinessUser"]
                },
                "email": {
                    "$in": [userDetails.email]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                if (allResults.length > 0) {
                    const existingUser = allResults[0];
                    if (existingUser.businessId.includes(userDetails.businessId)) {
                        const msg = {
                            msg: "User alerady exists"
                        };
                        return JSON.stringify(msg);
                    }
                    existingUser
                        .businessId
                        .push(userDetails.businessId);
                    await ctx
                        .stub
                        .putState(existingUser.email, Buffer.from(JSON.stringify(existingUser)));
                    return JSON.stringify(existingUser);
                }
                else {
                    const businesUser = new businessuser_1.BusinessUser();
                    businesUser.docType = "BusinessUser";
                    businesUser.email = userDetails.email;
                    businesUser.password = userDetails.password;
                    businesUser.name = userDetails.name;
                    businesUser.businessId = new Array();
                    businesUser
                        .businessId
                        .push(userDetails.businessId);
                    await ctx
                        .stub
                        .putState(businesUser.email, Buffer.from(JSON.stringify(businesUser)));
                    return JSON.stringify(businesUser);
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async getBusinessUser(ctx, businessUser) {
        console.info('============= START : Create Business ===========');
        const userDetails = JSON.parse(businessUser);
        const query = {
            "selector": {
                "docType": {
                    "$in": ["BusinessUser"]
                },
                "businessId": {
                    "$in": [userDetails.businessId]
                },
                "email": {
                    "$in": [userDetails.email]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                if (allResults.length > 0) {
                    return JSON.stringify(allResults);
                }
                else {
                    return "User not found";
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async createBusinessUserCart(ctx, cart) {
        console.info('============= START : Create Business ===========');
        const userDetails = JSON.parse(cart);
        await ctx
            .stub
            .putState(userDetails.cartId, Buffer.from(JSON.stringify(userDetails)));
        return JSON.stringify(userDetails);
        console.info('============= END : Create Business ===========');
    }
    async getBusinessUserCart(ctx, businessUser) {
        console.info('============= START : Create Business ===========');
        const userDetails = JSON.parse(businessUser);
        const query = {
            "selector": {
                "docType": {
                    "$in": ["Cart"]
                },
                "businessId": {
                    "$in": [userDetails.businessId]
                },
                "customerEmail": {
                    "$in": [userDetails.email]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                if (allResults.length > 0) {
                    return JSON.stringify(allResults);
                }
                else {
                    return "Cart not found";
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async createBusinessUserOrder(ctx, order) {
        console.info('============= START : Create Business ===========');
        const purchaseOrder = JSON.parse(order);
        await ctx
            .stub
            .putState(purchaseOrder.purchaseId, Buffer.from(JSON.stringify(purchaseOrder)));
        return JSON.stringify(purchaseOrder);
        console.info('============= END : Create Business ===========');
    }
    async getBusinessOrder(ctx, businessId, startDate, endDate, status) {
        console.info('============= START : Create Business ===========');
        console.info(startDate);
        let statusList = [];
        if (status === 'All') {
            statusList.push("PENDING");
            statusList.push("PAID");
            statusList.push("ACCEPTED");
            statusList.push("COMPLETED");
        }
        else if (status === 'Pending') {
            statusList.push("PENDING");
            statusList.push("PAID");
        }
        else if (status === 'Accepted') {
            statusList.push("ACCEPTED");
        }
        else if (status === 'Completed') {
            statusList.push("COMPLETED");
        }
        console.info("statusList");
        console.info(statusList);
        const query = {
            "selector": {
                "docType": {
                    "$in": ["PurchaseOrder"]
                },
                "businessId": {
                    "$in": [businessId]
                },
                "orderedAt": {
                    "$gt": startDate,
                    "$lt": endDate
                },
                "status": {
                    "$in": statusList
                }
            },
            "use_index": "orderedAt",
            "sort": [
                {
                    "orderedAt": "desc"
                }
            ]
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                if (allResults.length > 0) {
                    return JSON.stringify(allResults);
                }
                else {
                    return JSON.stringify(allResults);
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async getCustomerOrder(ctx, businessId, email) {
        console.info('============= START : Create Business ===========');
        const query = {
            "selector": {
                "docType": {
                    "$in": ["PurchaseOrder"]
                },
                "businessId": {
                    "$in": [businessId]
                },
                "customerEmail": {
                    "$in": [email]
                },
                "orderedAt": {
                    "$exists": true
                }
            },
            "use_index": "orderedAt",
            "sort": [
                {
                    "orderedAt": "desc"
                }
            ]
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                if (allResults.length > 0) {
                    return JSON.stringify(allResults);
                }
                else {
                    return "Orders not found";
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async updateOrderStatus(ctx, businessId, status, orderId) {
        console.info('============= START : Create Business ===========');
        const query = {
            "selector": {
                "docType": {
                    "$in": ["PurchaseOrder"]
                },
                "businessId": {
                    "$in": [businessId]
                },
                "purchaseId": {
                    "$in": [orderId]
                }
            }
        };
        const iterator = await ctx
            .stub
            .getQueryResult(JSON.stringify(query));
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                }
                catch (err) {
                    console.log(err);
                    Record = res
                        .value
                        .value
                        .toString('utf8');
                }
                allResults.push(Record);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                if (allResults.length > 0) {
                    const purchaseOrder = allResults[0];
                    purchaseOrder.status = status;
                    await ctx
                        .stub
                        .putState(purchaseOrder.purchaseId, Buffer.from(JSON.stringify(purchaseOrder)));
                    return JSON.stringify(purchaseOrder);
                }
                else {
                    return "Orders not found";
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async addApkURL(ctx, businessId, apkURL) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        business.apkUrl = apkURL;
        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }
}
exports.BusinessContract = BusinessContract;
//# sourceMappingURL=businesscontract.js.map