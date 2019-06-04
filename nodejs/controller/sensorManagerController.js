/**
 * Created by Duke on 2019/4/22.
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

    getSensorCount: function (req, res, next) {
        var cId = req.query.cId
        var gId = req.query.gId
        var part = req.query.part
        console.log(part)

        var where = ''
        var isOnline = ''
        var selectContent = ''

        if (part != null && part != undefined && part != '' && part != -1) {
            where += (" And Part = " + part)
            selectContent += "Part,COUNT(*)"
        } else {
            where += (" And Part in (0,1,2,3,4,5) ")
            selectContent += "Part,COUNT(*)"

        }

        if (cId != null && cId != undefined && cId != '') {
            where += (" And CountryId = " + cId)
        }
        if (gId != null && gId != undefined && gId != '') {
            where += (" AND GroupId = " + gId)
        }
        if (where != '') {
            where = ' where ' + where.substr(4)
            isOnline = " and state = 'online' "
        } else {
            isOnline = " where state = 'online' "
        }


        console.log('select ' + selectContent + ' as sensorCount from Sensor ' + where + ' GROUP BY Part')
        console.log('select ' + selectContent + ' as onLineCount from Sensor ' + where + isOnline + ' GROUP BY Part ')


        db.querySql('select ' + selectContent + ' as sensorCount from Sensor ' + where + ' GROUP BY PART ', '', function (err, result1) {
                console.log("result1")
                console.log(result1)
                var list1 = result1.recordset
                var emptySend = [{
                    'Part': 0,
                    'sensorCount': 0,
                    'onlineCount': 0,
                }, {
                    'Part': 1,
                    'sensorCount': 0,
                    'onlineCount': 0,
                }, {
                    'Part': 2,
                    'sensorCount': 0,
                    'onlineCount': 0,
                }, {
                    'Part': 3,
                    'sensorCount': 0,
                    'onlineCount': 0,
                }, {
                    'Part': 4,
                    'sensorCount': 0,
                    'onlineCount': 0,
                }, {
                    'Part': 5,
                    'sensorCount': 0,
                    'onlineCount': 0,
                }]

                if (list1.length == 0) {
                    sendRightRep(res, emptySend)
                } else {
                    for (var i in emptySend) {
                        for (var j in list1) {
                            if (emptySend[i].Part == list1[j].Part) {
                                emptySend[i].sensorCount = list1[j].sensorCount
                            }
                        }
                    }
                    db.querySql('select ' + selectContent + ' as onLineCount from Sensor ' + where + isOnline + ' GROUP BY PART ', '', function (err, result2) {
                        var list2 = result2.recordset

                        console.log('list2')

                        console.log(list2)
                        for (var i in emptySend) {
                            emptySend[i].onlineCount = 0
                            for (var j in list2) {
                                if (emptySend[i].Part == list2[j].Part) {
                                    emptySend[i].onlineCount = list2[j].onLineCount
                                }
                            }
                        }
                        sendRightRep(res,emptySend)
                    })
                }

            }
        )
        ;
    },


    setSensorGroup: function (req, res, next) {
        //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
        db.querySql("update Sensor set GroupId='" + req.body.gId + "' where ID='" + req.body.sId + "'", '', function (err, result) {//查询所有news表的数据
            sendRightRep(res, result)
        })
    }

    ,

    getSensors: function (req, res, next) {

        var where = ""
        where += getSensorWhere("ID", req.query.sId)
        where += getSensorWhere("Part", req.query.type)
        if (req.query.location != undefined && req.query.location != "") {
            where += (" and Location = '%" + req.query.location + "%'")
        }
        if (req.query.type == undefined || req.query.type == "") {
            where += " and Part != 5"
        }

        var page = req.query.from
        var pageSize = req.query.size
        if (pageSize == undefined) {
            pageSize = 500
        }
        where = " where " + where.substring(4)
        db.querySql("select top(" + pageSize + ") T1.*,T2.HawkerCentre  from (select * from Sensor " + where + " ) as T1 left join (select * from CountryTable) as T2 on t1.CountryID = t2.CountryID order by id desc", "", function (err, result) {
            if (result != null && result.recordsets[0] != null && result.recordsets[0].length > 0) {
                db.querySql("select top " + pageSize + " A1.*,A2.AlarmInfo,A2.Status,A2.CreateDate as AlarmCreateDate,A2.EndDate from(select ID from Sensor" + where + ") as A1, Alarm as A2 where A2.SensorID = A1.ID", "", function (err, res2) {
                    result.recordsets[0].forEach(item=> {
                        var s = []
                        res2.recordsets[0].forEach(item2 => {
                            if (item.ID == item2.ID) {
                                s.push(item2)
                            }
                        })
                        item.Alarms = s
                    })
                    sendRightRep(res, result.recordsets[0])
                })
            } else {
                sendRightRep(res, [])
            }
        })

    }
    ,

    getToilets: function (req, res, next) {


        var where = ""
        where += getSensorWhere("Comments", req.query.tId)
        where += getSensorWhere("Part", 5)
        where += getSensorWhere("CountryID", req.query.cId)
        where += getSensorWhere("GroupID", req.query.gId)

        var page = req.query.from
        var pageSize = req.query.size
        if (pageSize == undefined) {
            pageSize = 500
        }
        if (where.length > 4) {
            where = " where " + where.substring(4)
        }
        console.log("select top(" + pageSize + ") T1.*,T2.HawkerCentre  from (select * from Sensor " + where + " ) as T1 left join (select * from CountryTable) as T2 on t1.CountryID = t2.CountryID order by id desc")
        db.querySql("select top(" + pageSize + ") T1.*,T2.HawkerCentre  from (select * from Sensor " + where + " ) as T1 left join (select * from CountryTable) as T2 on t1.CountryID = t2.CountryID order by id desc", "", function (err, result) {

            if (result != null && result.recordsets[0] != null && result.recordsets[0].length > 0) {
                db.querySql("select top " + pageSize + " A2.*  from (select ID from  Sensor " + where + ") as A1, ToiletCS as A2 where A2.SensorID = A1.ID", "", function (err, res2) {
                    result.recordsets[0].forEach(item=> {
                        var s = []
                        res2.recordsets[0].forEach(item2 => {
                            if (item.ID == item2.SensorID) {
                                s.push(item2)
                            }
                        })
                        item.CsDetail = s

                    })
                    sendRightRep(res, result.recordsets[0])
                })
            } else {
                sendRightRep(res, [])
            }

        })

    }
    ,
    getTypes: function (req, res, next) {
        var s = [{'TypeNum': 0, 'TypeComment': 'Lift Sensor'}, {
            'TypeNum': 1,
            'TypeComment': 'Gas Sensor for Toilet'
        }, {'TypeNum': 2, 'TypeComment': 'Air Flow Sensor'}, {
            'TypeNum': 3,
            'TypeComment': 'Power Meter'
        }, {'TypeNum': 4, 'TypeComment': 'Water Sensor'}, {'TypeNum': 5, 'TypeComment': 'Toilet Feedback Program'}]
        sendRightRep(res, s)
    }
}

function isToiletFilter(bean) {
    return bean.Part != 5
}

function getSensorWhere(param, data) {
    if (data != undefined && data != "") {
        return " and " + param + " = '" + data + "'"
    } else {
        return ""
    }
}

function sendRightRep(res, result) {
    res.send({
        ret: 0,
        data: result
    });
}