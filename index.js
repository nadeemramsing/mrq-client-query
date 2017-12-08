var _ = require('lodash');

module.exports = function (req, res, next) {

    _.each(req.query, function (value, property) {

        if (isJSON(value)) {
            value = JSON.parse(value);

            Object.defineProperty(value, 'toLowerCase', {
                enumerable: false,
                value: function () {
                    return this;
                }
            });

            req.query[property] = value;
        }
    });

    next();

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