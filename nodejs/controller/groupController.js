/**
 * Created by Duke on 2019/5/11.
 */
/**
 * Created by Duke on 2019/5/11.
 */
var CountryDao = require("../dao/countryDao");
var Promise = require('promise');
var localMessage = require('../localMsg/localeMessage');
var md5 = require('md5');
var tokenIndex = require('../filter/tokenIndex');
var express = require('express');
var db = require('../sqlserver.js');
var moment = require('moment');
var router = express.Router();

module.exports = {
    updateGroup: function (req, res, next) {
        var id = req.body.id
        if (id == undefined || id.length <= 0) {
            sendRightRep(res, "数据不全");
        }
        var gId = req.body.gId

        var name = req.body.gName
        console.log('gId')
        console.log(gId)

        //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
        db.update({'GroupName': name,'GroupID':gId}, "", ' ID = ' + id, 'GroupTable', function (err, result) {
            sendRightRep(res, err != null ? err : {})
        });

    },
    delGroup: function (req, res, next) {
        var id = req.body.id
        console.log("select count(*) as count from Sensor where CountryID= " + req.body.cId + " and GroupID = " + id)

        db.querySql("select count(*) as count from Sensor where CountryID= " + req.body.cId + " and GroupID = " + id, '', function (err, result) {
            console.log(result.recordsets[0][0].count)
            if (result.recordsets[0][0].count > 0) {
                sendRightRep(res, "This group has sensors and shouldn't del it.")
            } else {
                db.del("where CountryID = " +req.body.cId + " and GroupID = " + id, '', "GroupTable", function (err, result) {
                    sendRightRep(res, result)
                })
            }
        })


    },

    addGroup: function (req, res, next) {
        var part = req.body.part
        var country = req.body.cId
        var name = req.body.gName
        var gId = req.body.gId
        var createDate = currentTime()
        db.add({
            'CountryID': country,
            'Part': part,
            'GroupName': name,
            'GroupId': gId,
            'CreateDate': createDate,
            'Operator': 'system'
        }, 'GroupTable', function (err, result2) {
            sendRightRep(res, result2)
        })

        //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
    },


}

function currentTime() {
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分

    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return (clock);
}

function sendRightRep(res, result) {
    if (typeof(result) == 'string') {
        res.send({
            ret: 1,
            message: result
        });
    } else {
        res.send({
            ret: 0,
            data: result
        });
    }

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
