'use strict';
var lightDao = require('./dao/lightDao');
var userDao = require('./dao/userDao')
var Promise = require('promise');
var localMessage = require('./localMsg/localeMessage')
var md5 = require('md5');
function route(app) {
    app.get('/page/login', function (req, res, next) {
        res.redirect('/login/login.html');
        return next();
    })

    app.get('/api/tree', function (req, res, next) {
        var userId = 1;
        lightDao.searchLight(userId)
            .then(function (results) {
                var jsonReturn = [];
                for (var i in results) {
                    var item = {
                        id: results[i].id,
                        Timestamp: results[i].Timestamp,
                        SolutionName: results[i].SolutionName,
                        Place: results[i].Place,
                    };
                    jsonReturn.push(item);
                }
                return jsonReturn;
            }).then(function (result) {
                var ss = [];
                for (var i in result) {
                    ss[i] = searchGate(result[i]);
                }
                return Promise.all(ss).then(values=> {
                    return values;
                })
            }).then(function (result) {
                res.send({
                    ret: 0,
                    data: result
                });
            }).catch(function (err) {
                console.log(err)
            });
    })


    app.get('/api/lights', function (req, res) {
            //res.setHeader("Access-Control-Allow-Origin", "*");
            var solutionId = req.query.solutionId;
            var gatewayId = req.query.gatewayId;
            var groupId = req.query.groupId;
            console.log("groupId:" + groupId);
            if (isNull(groupId)) {
                lightDao.searchGroupLights(solutionId, gatewayId).then(function (results) {
                    var lights = [];
                    for (var i in results) {
                        var item = {
                            id: results[i].id,
                            Mac: results[i].Mac,
                            Address: results[i].Address,
                            SensorState: results[i].SensorState,
                            IsUserControl: results[i].IsUserControl,
                            DelayTime: results[i].DelayTime,
                            MicrowaveSensitivity: results[i].MicrowaveSensitivity,
                            PhotoSensitivity: results[i].PhotoSensitivity,
                            LightState: results[i].LightState
                        }
                        lights.push(item);
                    }
                    res.send({
                        ret: 0,
                        data: lights
                    })
                });

            } else {
                lightDao.searchLights(solutionId, gatewayId, groupId).then(function (results) {
                    var lights = [];
                    for (var i in results) {
                        var item = {
                            id: results[i].id,
                            Mac: results[i].Mac,
                            Address: results[i].Address,
                            SensorState: results[i].SensorState,
                            IsUserControl: results[i].IsUserControl,
                            DelayTime: results[i].DelayTime,
                            MicrowaveSensitivity: results[i].MicrowaveSensitivity,
                            PhotoSensitivity: results[i].PhotoSensitivity,
                            LightState: results[i].LightState
                        }
                        lights.push(item);
                    }
                    res.send({
                        ret: 0,
                        data: lights
                    })
                });

            }
        }
    );


    app.post("/api/login", function (req, res) {
        var user = {};
        userDao.loginUsers(req.body.account).then(function (users) {
            if (!users || !users.length) throw new Error(localMessage.get('member.not.exists'));
            console.log("printin" + users[0].Password + " psbd " + md5(req.body.password));
            if (users[0].Password != md5(req.body.password)) throw new Error(localMessage.get('member.password.error'));
            user.account = req.body.account;
            user.token = req.body.account + "testToken";
            res.send({
                ret: 0,
                data: user
            })
        }).catch(function (err) {
            res.send({ret: 1, message: err.message})
        })
    });

    function searchGate(solution) {
        var promise = new Promise(function (resolve) {
            lightDao.searchGateway(solution.id)
                .then(function (results) {
                    var gateways = [];
                    for (var j in results) {
                        var item = {
                            id: results[j].id,
                            Mac: results[j].Mac,
                            Alias: results[j].Alias,
                            SolutionID: results[j].SolutionID,
                        }
                        gateways.push(item);
                    }
                    return gateways;
                })
                .then(function (results) {
                    var kk = [];
                    for (var i in results) {
                        kk[i] = searchGroup(results[i]);
                    }
                    return Promise.all(kk).then(values=> {
                        return values;
                    })
                }).then(function (results) {
                    var a = {
                        id: solution.id,
                        Timestamp: solution.Timestamp,
                        SolutionName: solution.SolutionName,
                        Place: solution.Place,
                        gateway: results
                    }
                    resolve(a);
                })
        })
        return promise;
    }

    function searchGroup(gateway) {
        var promise = new Promise(function (resolve) {
            lightDao.searchGroup(gateway.SolutionID, gateway.id).then(function (results) {
                var groups = [];
                for (var j in results) {
                    var item = {
                        id: results[j].id,
                        GroupAddress: results[j].Mac,
                        Alias: results[j].Alias,
                        SolutionID: results[j].SolutionID,
                        GatewayID: results[j].GatewayID
                    }
                    groups.push(item);
                }
                return groups;
            }).then(function (results) {
                var b = {
                    id: gateway.id,
                    Mac: gateway.Mac,
                    Alias: gateway.Alias,
                    SolutionID: gateway.SolutionID,
                    Group: results
                }
                resolve(b);
            })

        })
        return promise;
    };
    /**
     * 判断是否null
     * @param data
     */
    function isNull(data) {
        console.log("data:" + data);
        console.log("data == \"\":" + data == "");
        console.log("data == undefined:" + data == undefined);
        console.log("typeof(data) == 'undefined'" + typeof(data) == 'undefined');
        console.log("data == null" + typeof(data) == null);
        return data == "" || data == undefined || typeof(data) == 'undefined' || data == null;
    }
}

exports.route = route;