import {Context, Contract} from 'fabric-contract-api';
import {Business} from './business';
import {UserCredentials} from './usercredentials';
import {BusinessUtil} from './util/businessutil';
import {Category} from './category';
import {Product} from './product';
import {Addon} from './addons';
import {BusinessUser} from './businessuser';
import {BusinessUserReq} from './businessuserreq';
import {Cart} from './cart';
import {PurchaseOrder} from './purchaseOrder';
import {Appconfig} from './appconfig';
const ClientIdentity = require('fabric-shim').ClientIdentity;

export class BusinessContract extends Contract {

    private businessUtil = new BusinessUtil();

    public async createBusiness(ctx : Context, businessId : string, name : string, email : string, country : string, password : string, phone : string) {
        console.info('============= START : Create Business ===========');

        const usercredentials = this
            .businessUtil
            .generateUserCredentialsObject(password, email, password, businessId, "appconfig")
        const business = this
            .businessUtil
            .generateInitialBusinessObject(email, phone, businessId, name, country)

        await ctx
            .stub
            .putState(email, Buffer.from(JSON.stringify(usercredentials)));
        await ctx
            .stub
            .putState(businessId, Buffer.from(JSON.stringify(business)));
        console.info('============= END : Create Business ===========');
    }

    public async queryAllBusinesses(ctx : Context) : Promise < string > {

        const query = {
            "selector": {
                "docType": {
                    "$in": ["Business"]
                }
            }
        }
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
                } catch (err) {
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

    public async queryUser(ctx : Context, username : string) : Promise < string > {
        const userAsBytes = await ctx
            .stub
            .getState(username);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${username} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    public async queryBusiness(ctx : Context, businessNumber : string) : Promise < string > {
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

    public async updateBusinessTheme(ctx : Context, businessNumber : string, appconfig : string, theme : string) {
        console.info('============= START : updateBusinessTheme ===========');
        const appconfigDetails : Appconfig = JSON.parse(appconfig);
        const themeDetails : Appconfig = JSON.parse(theme);

        const businessAsBytes = await ctx
            .stub
            .getState(businessNumber);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business : Business = JSON.parse(businessAsBytes.toString());
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

    public async updateBusiness(ctx : Context, businessId : string, email : string, businessDetails : string) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        const userAsBytes = await ctx
            .stub
            .getState(email);
        const user : UserCredentials = JSON.parse(userAsBytes.toString());
        user.status = "appconfiged"
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

    public async updatePickupHours(ctx : Context, businessId : string, openHours) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business : Business = JSON.parse(businessAsBytes.toString());
        business.pickUpHours = openHours;

        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }

    public async updatePreparationTime(ctx : Context, businessId : string, preparationTime : number) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business : Business = JSON.parse(businessAsBytes.toString());
        business.orderPreparationTime = preparationTime;

        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }

    public async updateDeliveryStatus(ctx : Context, businessId : string) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business : Business = JSON.parse(businessAsBytes.toString());
        business.deliveryEnabled = !business.deliveryEnabled;

        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }

    public async addCategories(ctx : Context, category : string) {
        console.info('============= START : Create Business Category ===========');
        let clientIdentity = new ClientIdentity(ctx.stub);
        console.info(clientIdentity.getAttributeValue('hf.Type'));

        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            const categoryDetails : Category = JSON.parse(category);
            await ctx
                .stub
                .putState(categoryDetails.categoryId, Buffer.from(JSON.stringify(categoryDetails)));
        }

        console.info('============= END : Create Business Category ===========');
    }

    public async getCategories(ctx : Context, categoryNumber : string) {
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

    public async updateCategory(ctx : Context, category : string) {
        const categoryDetails : Category = JSON.parse(category);

        console.info('============= START : Get Business Category ===========');
        const categoryAsBytes = await ctx
            .stub
            .getState(categoryDetails.categoryId);
        if (!categoryAsBytes || categoryAsBytes.length === 0) {
            throw new Error(`${categoryDetails.categoryId} does not exist`);
        }

        const categoryFullDetails : Category = JSON.parse(categoryAsBytes.toString());
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

    public async queryAllCategories(ctx : Context, businessNumber : string) : Promise < string > {

        const query = {
            "selector": {
                "docType": {
                    "$in": ["Category"]
                },
                "businessId": {
                    "$in": [businessNumber]
                }
            }
        }
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
                } catch (err) {
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

    public async addProduct(ctx : Context, product : string) {
        console.info('============= START :Add Product ===========');
        console.info(product)
        const productDetails : Product = JSON.parse(product);
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

    public async queryAllProducts(ctx : Context, businessNumber : string) : Promise < string > {

        const query = {
            "selector": {
                "docType": {
                    "$in": ["Product"]
                },
                "businessId": {
                    "$in": [businessNumber]
                }
            }
        }
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
                } catch (err) {
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

    public async queryAllCategoryProducts(ctx : Context, businessNumber : string, categoryId : string) : Promise < string > {

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
        }
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
                } catch (err) {
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

    public async getProduct(ctx : Context, productNumber : string) {
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

    public async removeProduct(ctx : Context, productNumber : string, businessNumber : string) {
        console.info('============= START : Get Business Product ===========');
        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .deleteState(productNumber);
        }

        console.info('============= END : Get Business Product ===========');
    }

    public async removeCategory(ctx : Context, categoryNumber : string, businessNumber : string) {
        console.info('============= START : Get Business Product ===========');

        let clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getAttributeValue('hf.Type') === 'businessOwner') {
            await ctx
                .stub
                .deleteState(categoryNumber);
        }

        console.info('============= END : Get Business Product ===========');
    }

    public async updateProduct(ctx : Context, businessNumber : string, product : string) {
        const productDetails : Product = JSON.parse(product);
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

    public async createBusinessUser(ctx : Context, businessUser : string) {
        console.info('============= START : Create Business ===========');
        const userDetails : BusinessUserReq = JSON.parse(businessUser);

        const businessAsBytes = await ctx
            .stub
            .getState(userDetails.businessId);

        const business : Business = JSON.parse(businessAsBytes.toString());

        const query = {
            "selector": {
                "docType": {
                    "$in": ["BusinessUser"]
                },
                "email": {
                    "$in": [userDetails.email]
                }
            }
        }

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
                } catch (err) {
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
                    const existingUser : BusinessUser = allResults[0];
                    if (existingUser.businessId.includes(userDetails.businessId)) {
                        const msg = {
                            msg: "User alerady exists"
                        }
                        return JSON.stringify(msg);
                    }
                    existingUser
                        .businessId
                        .push(userDetails.businessId)

                    if (userDetails.notToken != null) {
                        if (!existingUser.notificationTokens.includes(userDetails.notToken)) {
                            existingUser
                                .notificationTokens
                                .push(userDetails.notToken)
                        }
                    }

                    if (business.notificationToken == undefined) {
                        business.notificationToken = new Array < string > ();
                    }

                    if (userDetails.notToken != null) {
                        if (!business.notificationToken.includes(userDetails.notToken)) {
                            business
                                .notificationToken
                                .push(userDetails.notToken)
                        }
                    }

                    await ctx
                        .stub
                        .putState(existingUser.email, Buffer.from(JSON.stringify(existingUser)));
                    return JSON.stringify(existingUser);

                } else {
                    const businesUser = new BusinessUser();
                    businesUser.docType = "BusinessUser";
                    businesUser.email = userDetails.email;
                    businesUser.password = userDetails.password;
                    businesUser.name = userDetails.name;
                    businesUser.phone = userDetails.phone;
                    businesUser.businessId = new Array < string > ();
                    businesUser
                        .businessId
                        .push(userDetails.businessId);
                    businesUser.notificationTokens = new Array < string > ();

                    if (userDetails.notToken != null) {
                        businesUser
                            .notificationTokens
                            .push(userDetails.notToken);
                    }

                    if (business.notificationToken == undefined) {
                        business.notificationToken = new Array < string > ();
                    }

                    if (userDetails.notToken != null) {
                        if (!business.notificationToken.includes(userDetails.notToken)) {
                            business
                                .notificationToken
                                .push(userDetails.notToken)
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

    public async getBusinessUser(ctx : Context, businessUser : string) {
        console.info('============= START : Create Business ===========');
        const userDetails : BusinessUserReq = JSON.parse(businessUser);

        const businessAsBytes = await ctx
            .stub
            .getState(userDetails.businessId);

        const business : Business = JSON.parse(businessAsBytes.toString());

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
        }

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
                } catch (err) {
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
                    const existingUser : BusinessUser = allResults[0];
                    if (existingUser.notificationTokens == undefined) {
                        existingUser.notificationTokens = new Array < string > ();
                    }
                    if (userDetails.notToken != null) {
                        if (!existingUser.notificationTokens.includes(userDetails.notToken)) {
                            existingUser
                                .notificationTokens
                                .push(userDetails.notToken)
                        }
                    }

                    if (business.notificationToken == undefined) {
                        business.notificationToken = new Array < string > ();
                    }

                    if (userDetails.notToken != null) {
                        if (!business.notificationToken.includes(userDetails.notToken)) {
                            business
                                .notificationToken
                                .push(userDetails.notToken)
                        }
                    }

                    await ctx
                        .stub
                        .putState(existingUser.email, Buffer.from(JSON.stringify(existingUser)));

                    await ctx
                        .stub
                        .putState(business.businessId, Buffer.from(JSON.stringify(business)));
                    return JSON.stringify(allResults);
                } else {
                    return "User not found";
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async createBusinessUserCart(ctx : Context, cart : string) {
        console.info('============= START : Create Business ===========');
        const userDetails : Cart = JSON.parse(cart);

        await ctx
            .stub
            .putState(userDetails.cartId, Buffer.from(JSON.stringify(userDetails)));
        return JSON.stringify(userDetails);

        console.info('============= END : Create Business ===========');
    }

    public async getBusinessUserCart(ctx : Context, businessUser : string) {
        console.info('============= START : Create Business ===========');
        const userDetails : BusinessUserReq = JSON.parse(businessUser);
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
        }

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
                } catch (err) {
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
                } else {
                    return "Cart not found";
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async createBusinessUserOrder(ctx : Context, order : string) {
        console.info('============= START : Create Business ===========');
        const purchaseOrder : PurchaseOrder = JSON.parse(order);

        await ctx
            .stub
            .putState(purchaseOrder.purchaseId, Buffer.from(JSON.stringify(purchaseOrder)));
        return JSON.stringify(purchaseOrder);

        console.info('============= END : Create Business ===========');
    }

    public async getBusinessOrder(ctx : Context, businessId : string, startDate : string, endDate : string, status) {
        console.info('============= START : Create Business ===========');
        console.info(startDate);

        let statusList = [];

        if (status === 'All') {
            statusList.push("PENDING");
            statusList.push("PAID");
            statusList.push("ACCEPTED");
            statusList.push("COMPLETED");
            statusList.push("REJECTED");
        } else if (status === 'Pending') {
            statusList.push("PENDING");
            statusList.push("PAID");
        } else if (status === 'Accepted') {
            statusList.push("ACCEPTED");
        } else if (status === 'Completed') {
            statusList.push("COMPLETED");
        } else if (status === 'Rejected') {
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
        }

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
                } catch (err) {
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
                } else {
                    return JSON.stringify(allResults);
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async getCustomerOrder(ctx : Context, businessId : string, email : string) {
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
        }

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
                } catch (err) {
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
                } else {
                    return "Orders not found";
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async updateOrderStatus(ctx : Context, businessId : string, status : string, orderId : string) {
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
        }

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
                } catch (err) {
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
                    const purchaseOrder : PurchaseOrder = allResults[0];
                    purchaseOrder.status = status;
                    await ctx
                        .stub
                        .putState(purchaseOrder.purchaseId, Buffer.from(JSON.stringify(purchaseOrder)));
                    return JSON.stringify(purchaseOrder);
                } else {
                    return "Orders not found";
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async addApkURL(ctx : Context, businessId : string, apkURL : string, appId: string) {
        console.info('============= START : Update Business ===========');
        const businessAsBytes = await ctx
            .stub
            .getState(businessId);
        if (!businessAsBytes || businessAsBytes.length === 0) {
            throw new Error(`${businessAsBytes} does not exist`);
        }
        const business : Business = JSON.parse(businessAsBytes.toString());
        business.apkUrl = apkURL;
        business.appId = appId;
        await ctx
            .stub
            .putState(businessId, Buffer.from((JSON.stringify(business))));
        console.info('============= END : Update Business ===========');
        return business.toString();
    }

    public async getOrder(ctx : Context, businessId : string, orderId : string) {
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
        }

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
                } catch (err) {
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
                    const purchaseOrder : PurchaseOrder = allResults[0];
                    return JSON.stringify(purchaseOrder);
                } else {
                    return "Orders not found";
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async batchProductUpload(ctx : Context, businessId : String, products : string) {
        const productDetails : Array < Product > = JSON.parse(products);
        console.info('============= START : Get Product CSV ===========');
        console.info(productDetails)

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

    public async getCategoryByName(ctx : Context, businessId : string, name : string) {
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
        }

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
                } catch (err) {
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
                    const category : Category = allResults[0];
                    return JSON.stringify(category);
                } else {
                    const category = {
                        msg: "Category not found"
                    }
                    return JSON.stringify(category);
                }
            }
        }

        console.info('============= END : Create Business ===========');
    }

    public async batchCategoryUpload(ctx : Context, businessId : String, categories : string) {
        const categoryDetails : Array < Category > = JSON.parse(categories);
        console.info('============= START : Get Product CSV ===========');
        console.info(categoryDetails)

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