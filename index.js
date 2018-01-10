var _ = require('lodash'), models;

module.exports = {
    handleJSON: handleJSON,
    setModel: setModel,
    customAPI: customAPI
};

function handleJSON(req, res, next) {
    _.each(req.query, function (value, property) {
        if (isJSON(value))
            req.query[property] = toJSON(value);
    });
    next();

    /* HELPER FUNCTIONS */
    function toJSON(value) {
        value = JSON.parse(value);

        Object.defineProperty(value, 'toLowerCase', {
            enumerable: false,
            value: function () {
                return this;
            }
        });
        return value;
    }

    function isJSON(value) {
        if ((value.indexOf && value.indexOf('{') === -1 && value.indexOf('}')) === -1)
            return false;

        try {
            JSON.parse(value);
        }
        catch (e) {
            return false
        }
        return true;
    }
}

function setModel(_models) {
    models = _models;
}

function customAPI(req, res) {
    var options = req.query;

    try {
        if (options.modelFn === 'aggregate')
            handleAggregate();
        else
            models
            [options.model]
            [options.modelFn](options.query || '')
                .select(options.select ? options.select.split(',').join(" ") : '')
                .populate(handlePopulate(options.populate))
                .skip(options.skip ? parseInt(options.skip) : 0)
                .limit(options.limit ? parseInt(options.limit) : 0)
                .sort(options.sort || {})
                .exec(function (err, response) {
                    if (err)
                        res.send(err);
                    else
                        res.send(options.modelFn === 'count' ? { count: response } : response);
                });
    } catch (e) {
        res.status(500).send(e);
    }

    /* HELPER FUNCTIONS */
    function handleAggregate() {
        var aggregation
            =
            models
            [options.model]
            ['aggregate'](options.pipelines);

        aggregation.options = _.assign({
            allowDiskUse: true
        }, options.aggregateOptions);

        aggregation.exec(function (err, response) {
            if (err)
                res.send(err);
            else
                res.send(response);
        })
    }

    function handlePopulate(populate) {
        if (typeof populate === 'string')
            return populate.split(',').join(" ");

        if (Array.isArray(populate))
            return parseArray(populate);
        else
            return populate || '';
    }

    function parseArray(array) {
        return _.map(array, function (v) {
            return JSON.parse(v);
        });
    }
}