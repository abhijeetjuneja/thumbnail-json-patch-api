exports.isJson = function(obj) {
    try {
        JSON.parse(JSON.stringify(obj));
    } catch (e) {
        return false;
    }
    return true;
};