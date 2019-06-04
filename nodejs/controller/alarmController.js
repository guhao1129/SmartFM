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



    setSensorAlarm: function (req, res, next) {
        var qIds = req.body.ids
        if(qIds==undefined || qIds.length <= 0){
            sendRightRep(res, "数据不全");
        }
        console.log(qIds)
        var ids = []
        if (req.body.ids != '') {
            ids = req.body.ids.split(',')
        }

        var s = ""
        for (var i in ids) {
            if (ids[i] != '') {
                if (i < ids.length - 1) {
                    s += 'ID = ' + ids[i] + ' OR '
                } else {
                    s += 'ID = ' + ids[i]
                }
            }
        }

        var a={}

        var alarmT = req.body.alarmT
        var alarmTR = req.body.alarmTR
        var alarmB = req.body.alarmB
        var alarmBR = req.body.alarmBR

        var postAddress1 = req.body.postAddress1

        var postAddress2 = req.body.postAddress2

        var postAddress3 = req.body.postAddress3

        if(alarmT!=undefined && alarmT.length > 0){
            a.AlarmT = alarmT
        }
        if(alarmTR!=undefined && alarmTR.length > 0){
            a.AlarmTR = alarmTR
        }
        if(alarmB!=undefined && alarmB.length > 0){
            a.AlarmB = alarmB
        }
        if(alarmBR!=undefined && alarmBR.length > 0){
            a.AlarmBR = alarmBR
        }

        //"2;3"
        //"2;3;4;5;3;4;3;4;3"

        if(postAddress1!=undefined && postAddress1.length > 0){
            a.PostAddress1 = postAddress1
        }
        if(postAddress2!=undefined && postAddress2.length > 0){
            a.PostAddress2 = postAddress2
        }
        if(postAddress3!=undefined && postAddress3.length > 0){
            a.PostAddress3 = postAddress3
        }


        var alarmStartTime = req.body.alarmStartTime
        var alarmEndTime = req.body.alarmEndTime

        if(alarmStartTime!=undefined && alarmStartTime.length > 0){
            a.AlarmStartTime = alarmStartTime
        }

        if(alarmEndTime!=undefined && alarmEndTime.length > 0){
            a.AlarmEndTime = alarmEndTime
        }

        var groupId = req.body.gId
        if(groupId!=undefined && groupId.length > 0){
            a.GroupID = groupId
        }


        //SELECT TOP [pageSize] * FROM [table] WHERE id NOT IN( SELECT TOP [preNum] id FROM [table] ORDER BY ID DESC) ORDER BY ID DESC
        db.update(a,"", s, 'Sensor', function (err, result) {
                sendRightRep(res,err!=null?err:{})
        });
    },

}

function sendRightRep(res, result) {
    if (typeof(result)=='String') {
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
