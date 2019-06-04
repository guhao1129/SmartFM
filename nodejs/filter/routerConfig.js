var getTestController = require("../controller/getTestController");
var SMController = require("../controller/sensorManagerController")
var CountryController = require("../controller/countryController");
var AlarmController = require("../controller/alarmController");
var GroupController = require("../controller/groupController");


module.exports = [
    {
        method: "get",
        path: "/api/water",
        handler: getTestController.getWaterMeter
    }, {
        method: "get",
        path: "/api/sensor",
        handler: getTestController.getSensorList
    }, {
        method: "post",
        path: "/api/addSetting",
        handler: getTestController.putAlarmSetting
    }, {
        method: "get",
        path: "/api/toiletcs",
        handler: getTestController.getToiletData
    }, {
        method: "post",
        path: "/api/toilet/confirm",
        handler: getTestController.setToiletData
    }, {
        method: "get",
        path: "/api/toiletpad",
        handler: getTestController.getToiletPad
    }
    , {
        method: "get",
        path: "/api/alarm",
        handler: getTestController.getAlarm
    }, {
        method: "get",
        path: "/api/warn",
        handler: getTestController.getWarn
    }
    , {
        method: "get",
        path: "/api/alarmCount",
        handler: getTestController.getAlarmCount
    }
    , {
        method: "get",
        path: "/api/power",
        handler: getTestController.getPowerSensor
    }, {
        method: "get",
        path: "/api/lift",
        handler: getTestController.getLiftSensor
    }, {
        method: "get",
        path: "/api/liftSingleData",
        handler: getTestController.getLiftSensorSingle
    },{
        method: "get",
        path: "/api/gas",
        handler: getTestController.getGasSensor
    }, {
        method: "get",
        path: "/api/flow",
        handler: getTestController.getFlowSensor
    },{
        method: "get",
        path: "/api/flowSingleData",
        handler: getTestController.getFlowSensorSingle
    },

    {
        method: "get",
        path: "/api/getMonthWater",
        handler: getTestController.getWaterMeterOther
    }, {
        method: "get",
        path: "/api/getMonthPower",
        handler: getTestController.getPowerMeterOther
    }, {
        method: "get",
        path: "/api/groupList",
        handler: getTestController.getGroupList
    }, {
        method: "get",
        path: "/api/sensors",
        handler: getTestController.getSensorList
    }, {
        method: "get",
        path: "/api/sensorsByGroup",
        handler: getTestController.getSensorsByGroup
    }, {
        method: "post",
        path: "/api/sensorset",
        handler: SMController.setSensorGroup
    }, {
        method: "get",
        path: "/api/querySensors",
        handler: SMController.getSensors
    }, {
        method: "get",
        path: "/api/queryToilets",
        handler: SMController.getToilets
    }, {
        method: "get",
        path: "/api/queryTypes",
        handler: SMController.getTypes
    }, {
        method: "get",
        path: "/api/getSensorByGroupIdOrLocation",
        handler: getTestController.getSensorsByGroupOrLocation
    }, {
        method: "get",
        path: "/api/countries",
        handler: CountryController.getCountries
    }, {
        method: "post",
        path: "/api/updateSensor",
        handler: AlarmController.setSensorAlarm
    }, {
        method: "post",
        path: "/api/updateGroup",
        handler: GroupController.updateGroup
    }, {
        method: "post",
        path: "/api/addGroup",
        handler: GroupController.addGroup
    },{
        method: "post",
        path: "/api/delGroup",
        handler: GroupController.delGroup
    },
    ,{
        method: "get",
        path: "/api/getSensorCount",
        handler: SMController.getSensorCount
    },


]
