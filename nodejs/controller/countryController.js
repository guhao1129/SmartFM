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

    getCountries :function (req,res,next){
        CountryDao.getAllCountries(function(err,result){
            console.log(err,result)
            if(err!=null){
                sendRightRep(res,err)
            }else{
                filterNull(result,function(result){
                    sendRightRep(res,result)
                })
            }
        })

    }
}

function sendRightRep(res, result) {
    if(result.isString){
        res.send({
            ret: 1,
            message: result
        });
    }else{
        res.send({
            ret: 0,
            data: result
        });
    }

}


function filterNull(result,fun){
    if(result!=null){
        for (var i in result.recordsets[0]) {
            changeDateFormat(result.recordsets[0][i])
        }
        return fun(result.recordsets[0])

    }else{
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
