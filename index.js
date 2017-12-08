module.exports = function (req, res, next) {
    var value;
    for (var property in req.query) {
        value = req.query[property];

        if (isJSON(value)) {
            req.query[property] = JSON.parse(value);

            Object.defineProperty(req.query[property], 'toLowerCase', {
                enumerable: false,
                value: function () {
                    return this;
                }
            });
        }
    }
    next();

    function isJSON(value) {
        if (value.indexOf && value.indexOf('{') === -1 && value.indexOf('}') === -1)
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