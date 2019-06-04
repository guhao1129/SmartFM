/**
 * Created by Duke on 2019/2/11.
 */

var TestDao = require("../dao/TestDao");
var Promise = require('promise');
var localMessage = require('../localMsg/localeMessage');
var md5 = require('md5');
var tokenIndex = require('../filter/tokenIndex');
var express = require('express');
var db = require('../sqlserver.js');
var moment = require('moment');
var router = express.Router();


module.exports = {

    //获得所有传感器数据
    getSensorList: function (req, res, next) {

        //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
        getSensorListDBs(req.query.part, req.query.cId, function (result) {

            if (req.query.gId == undefined) {
                console.log("111")

                sendRightRep(res, result);
            } else {
                var list = result.filter(function (item) {
                    return item.GroupID == req.query.gId
                })
                console.log(list)
                sendRightRep(res, list);
            }
        })
    },

    //设置警报数据
    putAlarmSetting: function (req, res, next) {
        //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC、
        db.querySql("insert into AlarmSetting (FloorValue,CeilingValue) values (" + req.query.floor + "," + req.query.ceiling + ")", '', function (err, result) {

            if (err != null) {
                console.log('alarmerr' + err)
            } else {
                sendRightRep(res, "设置警报成功")
            }

        })

    },

    //获得电梯传感数据
    getLiftSensor: function (req, res, next) {

        db.querySql("select * from (select row_number() over (partition by t2.CreateDate order by t1.ID) as group_idx,t1.Comments,t2.CreateDate,t1.ID,t2.AX,t2.AY,t2.AZ,t2.VX,t2.VY,t2.VZ,t2.IX,t2.IY,t2.IZ from Sensor  as t1 left join (select t1.* from LiftSensor as t1, (select max(CreateDate) as CreateDate,SensorID from LiftSensor group by SensorID) as t2 where t1.SensorID = t2.SensorID and t1.CreateDate = t2.CreateDate) as t2 on t1.ID = t2.SensorID where t1.GroupID = "+req.query.gId+" and t1.CountryID = "+req.query.cId+" and t1.Part = 0 ) as TT where TT.group_idx = 1 order by ID asc", '', function (err, result) {
            if (result != null) {
                sendRightRep(res, result.recordsets[0])
            } else {
                sendRightRep(res, [])
            }
        })

        //getSensorListDBForGroup(req.query.gId, req.query.cId, function (ress) {
        //    var ids = ""
        //    ress.forEach(item=> {
        //        ids += " SensorID = " +item.ID + " OR "
        //    })
        //    console.log("ress")
        //    console.log(ids)
        //    if (ids.length > 0) {
        //        ids = ids.substr(0, ids.length - 4)
        //        db.querySql("select top(1000) * from LiftSensor where " + ids, '', function (err, result) {
        //            if (result != null) {
        //                ress.forEach(item=> {
        //                    var his = []
        //                    result.recordsets[0].forEach(item2=> {
        //                        if (item2.SensorID == item.ID) {
        //                            his.push(item2)
        //                        }
        //                    })
        //                    item.his = his
        //                })
        //                return sendRightRep(res, ress)
        //            } else {
        //                sendRightRep(res, [])
        //
        //            }
        //
        //        })
        //    } else {
        //        sendRightRep(res, [])
        //    }
        //})


    },


    //获得电表数据 //分页加载
    getPowerSensor: function (req, res, next) {
        getSensorListDBForGroup(req.query.gId, req.query.cId, function (sensorList) {
            for (var i in sensorList) {
                sensorList[i].His = []
            }
            db.select('PowerMeter', 100, '', '', ' order by ID desc ', function (err, result) {//查询所有news表的数据
                for (var i in result.recordsets[0]) {
                    changeDateFormat(result.recordsets[0][i])
                    for (var j in sensorList) {
                        if (result.recordsets[0][i].SensorID == sensorList[j].ID) {
                            sensorList[j].His.push(result.recordsets[0][i])
                        }
                    }
                }
                sendRightRep(res, sensorList)
            });
        })


    },
    //获得水表数据 分页加载
    getWaterMeter: function (req, res, next) {

            getSensorListDBForGroup(req.query.gId, req.query.cId, function (sensorList) {
                for (var i in sensorList) {
                    sensorList[i].His = []
                }
                db.select('WaterMeter', 100, '', '', ' order by ID desc ', function (err, result) {//查询所有news表的数据
                    for (var i in result.recordsets[0]) {
                        changeDateFormat(result.recordsets[0][i])
                        for (var j in sensorList) {
                            if (result.recordsets[0][i].SensorID == sensorList[j].ID) {
                                sensorList[j].His.push(result.recordsets[0][i])
                            }
                        }
                    }
                    sendRightRep(res, sensorList)
                });
            })


    },
    //获得水表数据根据年月
    getWaterMeterOther: function (req, res, next) {
        var query = req.query.other
        var sensorId = req.query.id
        console.log("query", query)
        if (query.length == 7) {
            query += "-01"
        }
        console.log("exec HistoryData_Select " + (query.length == 4 ? "1" : "0") + ",4," + sensorId + ",0,0,'" + query + "','" + query + "'")

        db.querySql("exec HistoryData_Select " + (query.length == 4 ? "1" : "0") + ",4," + sensorId + ",0,0,'" + query + "','" + query + "'", "", function (err, result) {
            console.log(result.recordsets[0])
            if (result != null && result != undefined) {

                sendRightRep(res, result.recordsets[0])
            }
        })
    },
    //获得电表数据根据年月
    getPowerMeterOther: function (req, res, next) {
        var query = req.query.other
        var sensorId = req.query.id
        if (query.length == 7) {
            query += "-01"
        }
        console.log(query)
        console.log("exec HistoryData_Select " + (query.length == 4 ? "1" : "0") + ",3," + sensorId + ",0,0,'" + query + "','" + query + "'")


        db.querySql("exec HistoryData_Select " + (query.length == 4 ? "1" : "0") + ",3," + sensorId + ",0,0,'" + query + "','" + query + "'", "", function (err, result) {
            if (result != null && result != undefined) {
                console.log(result.recordsets[0])
                sendRightRep(res, result.recordsets[0])
            } else {
                sendRightRep(res, "err")
            }
        })
    },

    getSensorsByGroup(req, res, next){
        getSensorListDBForGroup(req.query.groupid, req.query.cId, function (data) {
            sendRightRep(res, data)
        })
    },


    getSensorsByGroupOrLocation(req, res, next){
        let s = req.query.query
        var reg = /[^\d]/
        if (reg.test(s)) {
            getSensorListDBForLocation(s, function (data) {
                if (data.isString) {
                    sendFailRep(res, data)
                } else {
                    sendRightRep(res, data)
                }
            })
        } else {
            getSensorListDBForGroup(s, req.query.cId, function (data) {
                if (data.isString) {
                    sendFailRep(res, data)
                } else {
                    sendRightRep(res, data)
                }
            })
        }


    },

    //获得风速传感器 //最近一时 最近一日 最近一月
    getFlowSensor: function (req, res, next) {
        console.log("select t1.Comments,t1.ID,t2.CreateDate,t2.AirFlowSpeed  from Sensor  as t1 left join (select t1.* from FlowSensor as t1, (select max(CreateDate) as CreateDate,SensorID from FlowSensor group by SensorID) as t2 where t1.SensorID = t2.SensorID and t1.CreateDate = t2.CreateDate) as t2 on t1.ID = t2.SensorID where t1.GroupID = " + req.query.gId + " and t1.CountryID = " + req.query.cId + " and t1.Part = 2 order by id asc")
        db.querySql("select t1.Comments,t1.ID,t2.CreateDate,t2.AirFlowSpeed  from Sensor  as t1 left join (select t1.* from FlowSensor as t1, (select max(CreateDate) as CreateDate,SensorID from FlowSensor group by SensorID) as t2 where t1.SensorID = t2.SensorID and t1.CreateDate = t2.CreateDate) as t2 on t1.ID = t2.SensorID where t1.GroupID = " + req.query.gId + " and t1.CountryID = " + req.query.cId + " and t1.Part = 2 order by id asc", '', function (err, result) {
            if (result != null) {
                sendRightRep(res, result.recordsets[0])
            } else {
                sendRightRep(res, [])
            }
        })
    },

    //获得风速传感器 //最近一时 最近一日 最近一月
    getLiftSensorSingle: function (req, res, next) {
        db.querySql("select top(100) * from LiftSensor where SensorID = " + req.query.id + " order by id desc", '', function (err, result) {
            if (result != null) {
                sendRightRep(res, result.recordsets[0])
            } else {
                sendRightRep(res, [])
            }
        })
    },

    //获得风速传感器 //最近一时 最近一日 最近一月
    getFlowSensorSingle: function (req, res, next) {
        db.querySql("select top(100) AirFlowSpeed,CreateDate from FlowSensor where SensorID = " + req.query.id + " order by id desc", '', function (err, result) {
            if (result != null) {
                sendRightRep(res, result.recordsets[0])
            } else {
                sendRightRep(res, [])
            }
        })
    },

    //获得智能厕所数据
    getToiletPad: function (req, res, next) {
        db.selectAll('ToiletPad', function (err, result) {//查询所有news表的数据
            sendRightRep(res, result.recordsets[0])
        });
    },

    //获得智能厕所数据 // 获得没有处理过的问题列表
    getToiletData: function (req, res, next) {
        getSensorListDBForGroup(req.query.gId, req.query.cId, function (sensers) {
            db.select('ToiletCS', 100, "where Status = 0  Order By ID desc", '', '', function (err, result) {//查询所有news表的数据
                var tcs = result.recordsets[0]
                for (var j in sensers) {
                    sensers[j].His = []
                    for (var i in tcs) {
                        if (tcs[i].SensorID == sensers[j].ID)
                            sensers[j].His.push(tcs[i])
                    }
                }
                sendRightRep(res, sensers)
            });


        })

    },

    //设置厕所数据
    setToiletData: function (req, res, next) {
        var ids = []
        if (req.query.ids != '') {
            ids = req.query.ids.split(',')
        }
        var s = []
        for (var i in ids) {
            if (ids[i] != '') {
                if (i < ids.length - 2) {
                    s += 'ID = ' + ids[i] + ' OR '
                } else {
                    s += 'ID = ' + ids[i]
                }
            }
        }
        var a = {
            "Status": 1
        }
        db.update(a, '', s, 'ToiletCS', function (err, result) {//查询所有news表的数据
            res.send({
                ret: 0,
                data: "修改成功"
            });
        });

    },

    getGroupList: function (req, res, next) {
        var part = req.query.part
        db.select('GroupTable', '', " where CountryID=" + req.query.cId + ' and GroupID !=0' + (part != undefined && part != null && part != '' ? ' and Part= ' + part : ''), '', '', function (err, result) {
            sendRightRep(res, result.recordsets[0])
        });

    },


    //获得厕所传感器数据 //分页加载数据
    getGasSensor: function (req, res, next) {

        getSensorListDBForGroup(req.query.gId, req.query.cId, function (sensorList) {
            db.select("GasSensor", 100, '', '', 'order by ID desc', function (err, result) {
                var gasList = result.recordsets[0]
                for (var i in sensorList) {
                    sensorList[i].His = []
                    sensorList[i].PadName = sensorList[i].Comments
                }
                for (var j in gasList) {
                    changeDateFormat(gasList[j])
                    for (var i in sensorList) {
                        if (gasList[j].SensorID == sensorList[i].ID) {
                            sensorList[i].His.push(gasList[j])
                        }
                    }
                }
                sendRightRep(res, sensorList)

            })
        })

    },

    getAlarmCount: function (req, res, next) {
        db.querySql("select count(*) as AlarmCount   from alarm as T1,Sensor as T2 where T1.SensorID = T2.ID and T2.CountryID = " + req.query.cId + " and T1.Status = 0", "", function (err, result) {
            console.log('ALARM COUNT')
            filterNull(result, function (ress) {
                if (ress.isString) {
                    sendFailRep(res, ress)
                } else {
                    sendRightRep(res, ress)
                }
            })

        })

    },

    getWarn: function (req, res, next) {
        var status = req.query.status
        var size = req.query.size
        var cId = req.query.cId

        if (size == null || size == undefined || size == '') {
            size = 100
        }

        db.querySql("select top(" + size + ") T1.AlarmInfo,T1.CreateDate ,T1.EndDate,T2.Comments,T1.ID  from alarm as T1,Sensor as T2 where T1.SensorID = T2.ID and T2.CountryID = " + cId + ((status == 0) ? ' and T1.Status = ' + status : '' ) +" and (T1.AlarmInfo = 'LoLiAL' or T1.AlarmInfo = 'HiLiAL')", '', function (err, result) {

            filterNull(result, function (ress) {
                if (ress.isString) {
                    sendFailRep(res, ress)
                } else {
                    var alarms = ress
                    alarms.forEach(item=> {
                        console.log(item)
                        var kk = ''
                        switch (item.AlarmInfo){

                            case "LoLiAL":
                                kk = "below threshold value"
                                break
                            case "HiLiAL":
                                kk = "above threshold value"
                                break



                        }
                        changeDateFormat(item)
                        item.Comment = item.CreateDate + '   ' + item.Comments + " " + kk
                        if (item.Status == 1) {
                            item.Comment += ' and stop at ' + item.EndDate
                        }

                    })
                    sendRightRep(res, alarms)
                }
            })
        })


    },

    //获得警报数据 //看到
    getAlarm: function (req, res, next) {
        var status = req.query.status
        var size = req.query.size
        var cId = req.query.cId

        if (size == null || size == undefined || size == '') {
            size = 100
        }


        db.querySql("select top(" + size + ") T1.AlarmInfo,T1.CreateDate ,T1.EndDate,T2.Comments,T1.ID  from alarm as T1,Sensor as T2 where T1.SensorID = T2.ID and T2.CountryID = " + cId + ((status == 0) ? ' and T1.Status = ' + status : '')+" and (T1.AlarmInfo = 'LoAL' or  T1.AlarmInfo = 'HiAL')", '', function (err, result) {

            filterNull(result, function (ress) {
                if (ress.isString) {
                    sendFailRep(res, ress)
                } else {
                    var alarms = ress
                    alarms.forEach(item=> {
                        console.log(item)
                        changeDateFormat(item)
                        var kk = ""
                        switch (item.AlarmInfo){
                            case "HiAL":
                                kk = "above threshold value"
                                break
                            case "LoAL":
                                kk = "below threshold value"
                                break

                        }
                        item.Comment = item.CreateDate + '   ' + item.Comments + " " + kk
                        if (item.Status == 1) {
                            item.Comment += ' and stop at ' + item.EndDate
                        }

                    })
                    sendRightRep(res, alarms)
                }
            })
        })


    },

}

function getSensorListDBs(part, countryId, fun) {
    //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
    db.select('Sensor', "", " where" + ((part != '' && part != undefined) ? ' Part = ' + part + ' and' : '') + ' CountryID = ' + countryId, '', '', function (err, result) {//查询所有news表的数据
        for (var i in result.recordsets[0]) {
            changeDateFormat(result.recordsets[0][i])
        }
        return fun(result.recordsets[0])
    });

}

function getSensorListDB(part, cId, fun) {
    //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
    db.select('Sensor', "", ' where ' + ((part != '' && part != undefined) ? ' Part = ' + part + ' and ' : '') + ' CountryID =' + cId, '', '', function (err, result) {//查询所有news表的数据
        return fun(result.recordsets[0])
    });

}
function getSensorListDBForGroup(goupId, cId, fun) {
    //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
    db.select('Sensor', "", " where " + ((goupId != '' && goupId != undefined) ? ' GroupID = ' + goupId + ' and ' : '') + ' CountryID =' + cId, '', '', function (err, result) {//查询所有news表的数据
        filterNull(result, fun)
    });
}

function getSensorListDBForLocation(location, fun) {
    //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
    db.select('Sensor', "", ((location != '' && location != undefined) ? "where Location like '%" + location + "%'" : ''), '', '', function (err, result) {//查询所有news表的数据
        filterNull(result, fun)
    });
}

function filterNull(result, fun) {
    if (result != null) {
        for (var i in result.recordsets[0]) {
            changeDateFormat(result.recordsets[0][i])
        }
        return fun(result.recordsets[0])

    } else {
        return fun("SQL SERVER ERROR")
    }
}


//2019-02-01T10:53:27.000Z
function changeDateFormat(bean) {

    var d = new Date(new Date(bean.CreateDate).getTime() - 1000 * 60 * 60 * 8);
    var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? ('0' + d.getSeconds()) : d.getSeconds());
    bean.CreateDate = resDate
    if (bean.EndDate != '' && bean.EndDate != undefined) {
        var d = new Date(bean.EndDate);
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes()) + ':' + (d.getSeconds() < 10 ? ('0' + d.getSeconds()) : d.getSeconds());
        bean.EndDate = resDate
    }
    //var a =  bean.CreateDate.substr(5,10)+bean.CreateDate.substr(11,19)
    //bean.CreateDate = a
}

function sendRightRep(res, result) {
    res.send({
        ret: 0,
        data: result
    });
}

function sendFailRep(res, result) {
    res.send({
        ret: 1,
        message: result
    });
}