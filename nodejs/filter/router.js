var routeConfig = require('../filter/routerConfig');

module.exports.route = function (server) {
    routeConfig.forEach(function (routeItem) {
        server[routeItem.method](routeItem.path, routeItem.handler);
    });
}
