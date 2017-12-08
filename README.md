# mrq-client-query
A mongoose middleware extending the behavior of mongoose-rest-query, providing more flexibility by allowing querying to be done at client.

----------

**Motivation**
- Less code @ server for queries that requires Query Operators
    - Less middlewares
    - Less routes
    - Less controllers

**Set up**
```js
var mrqClient = require('mrq-client-query'),
    app = require('express')();

app.use(mrqClient);
```

**Use**

In addition to mongoose-rest-query, the following query operators can be used:
- $eq
- $ne
- $exists
- $regex
- $text

(not all have been tested)

mrq already allows:
- $gte
- $gt
- $lte
- $lt
- $ne (Bug in mrq, 'null' was being passed by Mongoose to MongoDB as string)
- $in
- $nin

**Limitations**
- Query operators which uses arrays cannot be used:

    E.g:

    ```js
    var query = {
                type: TYPE.clothing,
                $or:
                    [
                        {
                            hasDesignations: false

                        },
                        {
                            parentDesignation: { $ne: null }
                        }
                    ]
    }
    
    ```

    mongoose-rest-query converts the array into:
    ```js
    { '$and': [ 
            { $or: { hasDesignations: false }, 
            { $or: { parentDesignation: { $ne: null } }
        ]
    }
    ```
    ERROR: $or needs array
    

----------

Version of mongoose-rest-query tested: 0.1.6