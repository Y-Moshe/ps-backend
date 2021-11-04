# Getting Started

1. Clone the repository then Run: `npm install` to install package dependencies.
2. Create `.env` file at the root of the project.
3. Copy & Paste content from the `.env.example` file into `.env` you just created.
4. Fill the `API Keys / environment variables`.
5. Run the server using `npm start` command.

### Authentication Method

The application using `Authorization` header and the token should be sent as `Bearer {TOKEN}`!

---

### Middlewares

#### authenticate
Shortcut for `passport.authenticate method with additional option { session: false }` set.

#### authorize
```args: ( roleNumber: number )```  
With this middleware you can limit User Access to any specific route.  
You should use [Roles](#Roles) object for the middleware argument.

    Example:
    routes.get('', authenticate, authorize( Roles.MANAGER ), ... );

This will allow Manager Role and higher Roles to access the route!  
`NOTE:` set `0` number to allow all, or don't set [authorize](#authorize) middleware at all.  
`REQUIRE:` [authenticate](#authenticate) middleware to be applied before!

#### validateIds
The middleware will check validation using [isValidId](#isValidId) utility  
Will validate any paramters that contains an `id` word, so for example:

    req.params.id
    req.query.id

Will pass validation!

#### Roles
Simple object with numbers assign to it

    const Roles = {
        MEMBER: 1,
        EDITOR: 2,
        MANAGER: 3,
        ADMINISTRATOR: 4,
        S_ADMINISTRATOR: 5
    };

## The Request object
The following properties are assigned to the `request` object for any useful cases by the app.

1. `req.baseURI` - holds the base URI, `/api/v@` - @ - as for any API Version.(`string`)
2. `req.user` - hold user schema object, refer to [User](#User) schema for more info.(`object`)
    `REQUIRE:` [authenticate](#authenticate) middleware to be applied in the route!
3. `req.userLevel` - hold the user role id as `number` also the number indicates the user level  
   for example, an `Administrator` level will always be bigger number than `Editor`!  
   `REQUIRE:` [authenticate](#authenticate) and [authorize](#authorize) middlewares to be applied in the route!

---

### Models Schemas

#### Category
    Category {
        _id: ObjectId;
        name: string;
    }

#### Comment
    Comment {
        _id: ObjectId;
        text: string;
        lastEdit: Date | null;
        user: ObjectId;
        product: ObjectId;
        creationDate: Date;
    }

#### Order
    Order {
        _id: ObjectId;
        user: ObjectId;
        country: string;
        city: string;
        streetAddress: string | undefined;
        province: string | undefined;
        zipCode: string;
        phone: string;
        products: ObjectId[];
        quantities: {
            [ObjectId]: number
        };
        status: string;
        receivedAt: Date | null;
        creationDate: Date;
    }

#### Product
    Product {
        _id: ObjectId;
        name: string;
        description: string | undefined;
        imagePath: string;
        price: number;
        content: string | undefined;
        category: ObjectId;
        comments: ObjectId[];
        creationDate: Date;
    }

#### Role
    Role {
        _id: number;
        title: string;
        description: string | undefined;
    }

#### User
    User {
        _id: ObjectId;
        email: string;
        password: string;
        firstName: string | undefined;
        lastName: string | undefined;
        userName: string;
        imagePath: string;
        isVerified: boolean;
        orders: ObjectId[];
        role: number;
        creationDate: Date;
    }

---

### Utils folder

#### CustomError
```args: ( message: string, status: number )```  
Simple `CustomError` class that extends `Error` class.  
When you throw any error in the app you should use this class  
`status` - stands for the status response code.

    Example:
    throw new CustomError( 'This is error', 500 )

And the rest will be handle by global `error-handler` middleware!

#### getPopulateQuery
```args: ( queryParams: object, ...fields )```  
Get a string to be used for `mongoose.populate` method from the request query params object.  
`queryParams` - should just be the `req.query` object.  
`fields` - the fields you want to populate.

    Example:
    getPopulateQuery( req.query, 'user', 'product', 'none' )

if the `req.query` has `user` set to `1` and `product` set to `0` and `none` is not exists  
the following string is returned: `user` :)  
and if `product` was set to `1` then: `user product` `NOTE` to the white space!

#### getVersion
Get application version from the `package.json`.

#### isValidId
```args: ( id: string )```  
Shotcut for `mongoose.Types.ObjectId.isValid` function.

#### safeCombine
```args: ( objA, ObjB )```  
Combine two objects together, if both objects has the same `property` an error is occurs!

---

# API Documentation

[Postman Documentation](https://documenter.getpostman.com/view/8382285/TzecBjmq)
