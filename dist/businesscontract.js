"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const businessutil_1 = require("./util/businessutil");
const businessuser_1 = require("./businessuser");
const ClientIdentity = require('fabric-shim').ClientIdentity;
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
    async updateBusinessTheme(ctx, businessNumber, appconfig, theme) {
        console.info('============= START : updateBusinessTheme ===========');
        const appconfigDetails = JSON.parse(appconfig);
        const themeDetails = JSON.parse(theme);
        const businessAsBytes = await ctx
            .stub
            .getState(businessNumber);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        const updatedBusiness = this
            .businessUtil
            .generateBusinessThemeObject(business, appconfigDetails, themeDetails);
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .putState(businessNumber, Buffer.from(JSON.stringify(updatedBusiness)));
        }
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
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .putState(email, Buffer.from((JSON.stringify(user))));
            await ctx
                .stub
                .putState(businessId, Buffer.from((businessDetails)));
        }
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
    async addCategories(ctx, category) {
        console.info('============= START : Create Business Category ===========');
        let clientIdentity = new ClientIdentity(ctx.stub);
        console.info(clientIdentity.getAttributeValue('hf.Type'));
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            const categoryDetails = JSON.parse(category);
            await ctx
                .stub
                .putState(categoryDetails.categoryId, Buffer.from(JSON.stringify(categoryDetails)));
        }
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
    async updateCategory(ctx, category) {
        const categoryDetails = JSON.parse(category);
        console.info('============= START : Get Business Category ===========');
        const categoryAsBytes = await ctx
            .stub
            .getState(categoryDetails.categoryId);
        if (!categoryAsBytes || categoryAsBytes.length === 0) {
            throw new Error(`${categoryDetails.categoryId} does not exist`);
        }
        const categoryFullDetails = JSON.parse(categoryAsBytes.toString());
        categoryFullDetails.image = categoryDetails.image;
        categoryFullDetails.name = categoryDetails.name;
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .putState(categoryDetails.categoryId, Buffer.from(JSON.stringify(categoryFullDetails)));
        }
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
    async addProduct(ctx, product) {
        console.info('============= START :Add Product ===========');
        console.info(product);
        const productDetails = JSON.parse(product);
        console.info('============= START :Add Product Parsed ===========');
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .putState(productDetails.productId, Buffer.from(JSON.stringify(productDetails)));
        }
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
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .deleteState(productNumber);
        }
        console.info('============= END : Get Business Product ===========');
    }
    async removeCategory(ctx, categoryNumber, businessNumber) {
        console.info('============= START : Get Business Product ===========');
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .deleteState(categoryNumber);
        }
        console.info('============= END : Get Business Product ===========');
    }
    async updateProduct(ctx, businessNumber, product) {
        const productDetails = JSON.parse(product);
        console.info('============= START : Get Product Category ===========');
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .putState(productDetails.productId, Buffer.from(JSON.stringify(productDetails)));
        }
        console.info('============= END : Get Product Category ===========');
        return productDetails.toString();
    }
    async createBusinessUser(ctx, businessUser) {
        console.info('============= START : Create Business ===========');
        const userDetails = JSON.parse(businessUser);
        const businessAsBytes = await ctx
            .stub
            .getState(userDetails.businessId);
        const business = JSON.parse(businessAsBytes.toString());
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
                    if (userDetails.notToken != null) {
                        if (!existingUser.notificationTokens.includes(userDetails.notToken)) {
                            existingUser
                                .notificationTokens
                                .push(userDetails.notToken);
                        }
                    }
                    if (business.notificationToken == undefined) {
                        business.notificationToken = new Array();
                    }
                    if (userDetails.notToken != null) {
                        if (!business.notificationToken.includes(userDetails.notToken)) {
                            business
                                .notificationToken
                                .push(userDetails.notToken);
                        }
                    }
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
                    businesUser.phone = userDetails.phone;
                    businesUser.businessId = new Array();
                    businesUser
                        .businessId
                        .push(userDetails.businessId);
                    businesUser.notificationTokens = new Array();
                    if (userDetails.notToken != null) {
                        businesUser
                            .notificationTokens
                            .push(userDetails.notToken);
                    }
                    if (business.notificationToken == undefined) {
                        business.notificationToken = new Array();
                    }
                    if (userDetails.notToken != null) {
                        if (!business.notificationToken.includes(userDetails.notToken)) {
                            business
                                .notificationToken
                                .push(userDetails.notToken);
                        }
                    }
                    await ctx
                        .stub
                        .putState(businesUser.email, Buffer.from(JSON.stringify(businesUser)));
                    await ctx
                        .stub
                        .putState(business.businessId, Buffer.from(JSON.stringify(business)));
                    return JSON.stringify(businesUser);
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async getBusinessUser(ctx, businessUser) {
        console.info('============= START : Create Business ===========');
        const userDetails = JSON.parse(businessUser);
        const businessAsBytes = await ctx
            .stub
            .getState(userDetails.businessId);
        const business = JSON.parse(businessAsBytes.toString());
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
                    const existingUser = allResults[0];
                    if (existingUser.notificationTokens == undefined) {
                        existingUser.notificationTokens = new Array();
                    }
                    if (userDetails.notToken != null) {
                        if (!existingUser.notificationTokens.includes(userDetails.notToken)) {
                            existingUser
                                .notificationTokens
                                .push(userDetails.notToken);
                        }
                    }
                    if (business.notificationToken == undefined) {
                        business.notificationToken = new Array();
                    }
                    if (userDetails.notToken != null) {
                        if (!business.notificationToken.includes(userDetails.notToken)) {
                            business
                                .notificationToken
                                .push(userDetails.notToken);
                        }
                    }
                    await ctx
                        .stub
                        .putState(existingUser.email, Buffer.from(JSON.stringify(existingUser)));
                    await ctx
                        .stub
                        .putState(business.businessId, Buffer.from(JSON.stringify(business)));
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
            statusList.push("REJECTED");
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
        else if (status === 'Rejected') {
            statusList.push("REJECTED");
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
    async addApkURL(ctx, businessId, apkURL, appId) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business = JSON.parse(businessAsBytes.toString());
        business.apkUrl = apkURL;
        business.appId = appId;
        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }
    async getOrder(ctx, businessId, orderId) {
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
                if (allResults.length > 0) {
                    const purchaseOrder = allResults[0];
                    return JSON.stringify(purchaseOrder);
                }
                else {
                    return "Orders not found";
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async batchProductUpload(ctx, businessId, products) {
        const productDetails = JSON.parse(products);
        console.info('============= START : Get Product CSV ===========');
        console.info(productDetails);
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            for (let i = 0; i < productDetails.length; i++) {
                await ctx
                    .stub
                    .putState(productDetails[i].productId, Buffer.from(JSON.stringify(productDetails[i])));
            }
        }
        console.info('============= END : Get Product Category ===========');
        return productDetails.toString();
    }
    async getCategoryByName(ctx, businessId, name) {
        console.info('============= START : Create Business ===========');
        const query = {
            "selector": {
                "docType": {
                    "$in": ["Category"]
                },
                "businessId": {
                    "$in": [businessId]
                },
                "name": {
                    "$in": [name]
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
                if (allResults.length > 0) {
                    const category = allResults[0];
                    return JSON.stringify(category);
                }
                else {
                    const category = {
                        msg: "Category not found"
                    };
                    return JSON.stringify(category);
                }
            }
        }
        console.info('============= END : Create Business ===========');
    }
    async batchCategoryUpload(ctx, businessId, categories) {
        const categoryDetails = JSON.parse(categories);
        console.info('============= START : Get Product CSV ===========');
        console.info(categoryDetails);
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            for (let i = 0; i < categoryDetails.length; i++) {
                await ctx
                    .stub
                    .putState(categoryDetails[i].categoryId, Buffer.from(JSON.stringify(categoryDetails[i])));
            }
        }
        console.info('============= END : Get Product Category ===========');
        return categoryDetails.toString();
    }
}
exports.BusinessContract = BusinessContract;
//# sourceMappingURL=businesscontract.js.map