/**
 * Created by Duke on 2019/3/27.
 */

const url = "http://111.231.55.121:8089";
//const url = "http://localhost:8089";


$(document).ready(function () {
    checkfresh()
});

function checkfresh() {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square',
        increaseArea: '20%' // optional
    });
}
$(function () {
    //全选,设置chheckbox name='all' tbody id=tb
    $(".iCheck-helper").click(function () {
        if ($(this).parents().hasClass("checked")) {
            $(".in2putlists").prop("checked", true);
        } else {
            $(".inputlists").prop("checked", false);
        }
    });
});
//单选 设置name=id
function userCheck(ths) {
    if (ths.checked == false) {
        $("input[name=all]:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='id']:checkbox:checked").length;
        if (count == $("input[name='id']:checkbox").length) {
            $("input[name=all]:checkbox").prop("checked", true);
        }
    }
}
$('.form_year_time').datetimepicker({
    //language:  'fr',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    minView: 4,
    todayHighlight: 1,
    startView: 4,
    forceParse: 0,
    language: 'en',
    startDate: "2018-01-01",
    endDate: "2019-04-01",
    showMeridian: 1
}).on('changeDate', function (ev) {
    var m = ev.valueOf().date.getMonth() + 1
    $('#water-y-picker').val(ev.valueOf().date.getFullYear())
});

$('.form_month_time').datetimepicker({
    //language:  'fr',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    minView: 3,
    todayHighlight: 1,
    startView: 3,
    forceParse: 0,
    language: 'en',
    startDate: "2018-01-01",
    endDate: "2019-04-01",
    showMeridian: 1
}).on('changeDate', function (ev) {
    var m = ev.valueOf().date.getMonth() + 1
    $('#water-m-picker').val(ev.valueOf().date.getFullYear() + "-" + (m < 10 ? '0' + m : m))
});

$('.form_p_year_time').datetimepicker({
    //language:  'fr',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    minView: 4,
    todayHighlight: 1,
    startView: 4,
    forceParse: 0,
    language: 'en',
    startDate: "2018-01-01",
    endDate: "2019-04-01",
    showMeridian: 1
}).on('changeDate', function (ev) {
    var m = ev.valueOf().date.getMonth() + 1
    $('#power-y-picker').val(ev.valueOf().date.getFullYear())
});

$('.form_p_month_time').datetimepicker({
    //language:  'fr',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    minView: 3,
    todayHighlight: 1,
    startView: 3,
    forceParse: 0,
    language: 'en',
    startDate: "2018-01-01",
    endDate: "2019-04-01",
    showMeridian: 1
}).on('changeDate', function (ev) {
    var m = ev.valueOf().date.getMonth() + 1
    $('#power-m-picker').val(ev.valueOf().date.getFullYear() + "-" + (m < 10 ? '0' + m : m))
});

/**
 * 点击水表取月份值
 */
$('#water-m-con').click(function () {
    var m = $('#water-m-picker').val()
    var bean = waterHistory[waterTag]
    if (m.length == 0) {
        alert("请选择时间")
    } else {
        getWaterMeter(m, bean.ID, bean.Comments);
    }
})
/**
 * 点击水表取年份值
 */
$('#water-y-con').click(function () {
    var bean = waterHistory[waterTag]
    var y = $('#water-y-picker').val()
    if (y.length == 0) {
        alert("请选择时间")
    } else {
        getWaterMeter(y, bean.ID, bean.Comments)
    }
})

/**
 * 点击电表取月份值
 */
$('#power-m-con').click(function () {
    var bean = powerHistory[powerTag]

    var m = $('#power-m-picker').val()
    if (m.length == 0) {
        alert("请选择时间")
    } else {
        getPowerMeter(m, bean.ID, bean.Comments)

    }
})
/**
 * 点击电表取年份值
 */
$('#power-y-con').click(function () {
    var bean = powerHistory[powerTag]

    var y = $('#power-y-picker').val()
    if (y.length == 0) {
        alert("请选择时间")
    } else {
        getPowerMeter(y, bean.ID, bean.Comments)

    }
})
let types = ["Lift Sensor", "Gas Sensor", "Flow Sensor", "Power Meter", "Water Meter", "ToiletCs", "", "All"]
let typesSingle = ["Lift Sensor", "Gas Sensor", "Flow Sensor", "Power Meter", "Water Meter", "ToiletCs"]

$('.type-group li').click(function () {
    var index = $(this).index()
    $("#type-choose-group").html(types[index])
    getGroupManagerList(index < 6 ? index : -1);
})

var mChooseType = 7;
var mChooseConfig = 0; //0 全部 1 未配置

$('.type-sensor li').click(function () {
    var index = $(this).index()
    $("#type-choose").html(types[index])
    mChooseType = index
    getSensors();
})


// 定义常量

var country;
let powerHistory = [];
let waterHistory = [];
let waterTag = 0
let powerTag = 0
let alarmRightNow = ''
let checkArry = []
// 初始化页面
/**
 * 获取组列表
 */

var countryId;
function getSensorsNumbers() {
     countryId = getUrlParam("cId")
    if (countryId == undefined) {
        countryId = 9999
    }
    $.get(url + '/api/getSensorCount' + (countryId == -1 ? '' : '?cId=' + countryId), function (res) {
        var s = ''
        var total = 0
        var totalOnline = 0

        var sensorCountList = []
        var sensorOnlineList = []
        var list = []
        var bgColor = []
        for (var i in res.data) {

            var a = []
            var b = {}
            a[0] = res.data[i].onlineCount
            a[1] = res.data[i].sensorCount - res.data[i].onlineCount
            b.data = a
            b.color = [bg(), bg()]
            b.labers = ['online', 'offline']
            b.title = typesSingle[i]
            b.type = i
            list.push(b)

            sensorCountList.push(res.data[i].sensorCount)
            bgColor.push(bg())
            sensorOnlineList.push(res.data[i].onlineCount)
            total += res.data[i].sensorCount
            totalOnline += res.data[i].onlineCount
        }
        $('.total-number').text(total)
        console.log(list)
        drawPieChart(sensorCountList, list, bgColor)
    })


}


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

$(document).ready(function () {
    console.log("开始了")
    if (getUrlParam("cId")) {
        country = "cId=" + getUrlParam("cId")
    } else {
        country = "cId=9999"
    }

    $('.country-name').text(getUrlParam("cName"))



    getGroupList();
    getSensors();
    getAlarms();
    //getAlarmConfig();
    getSensorsNumbers();
    //let timer1 = setInterval(function () {
    //    getLift();
    //    getGroupList();
    //
    //    getPowerMeterList();
    //    getWaterMeterList();
    //    getTolietRecord();
    //    getTolietCs();
    //}, 1000 * 10)
    let timer2 = setInterval(function () {
        getAlarms();
    }, 1000 * 5)
})

$('.sidebar-toggle').click(function () {
    hideNav()
})
// tab切换
$("#sidebar li").click(function () {
    console.log("zoule1")
    $(this).addClass("active").siblings().removeClass("active");
    if ($(this).index() == 0) {
        $(".tabcontent").removeClass("active");
        $(".tabcontent").eq(0).addClass("active");
    }else{
        getGroupList()
    }

})

$("#man-head li").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    var index = $(this).index();
    $(".tabcontent").removeClass("active");
    $(".tabcontent").eq(index + 1).addClass("active");

    if (index == 1) {

    } else if (index == 2) {
        getSensors()
    }


})



//通过groupId 或者 location搜索传感器
var requestSensorByGroupIdOrLocation = function (val, f) {
    $.get(url + '/api/getSensorByGroupIdOrLocation?query=' + val + "&" + country, function (res) {
        f(res)
    })
}


//厕所故障确认
$(".toiletcs-button").click(function () {
    TolietCsComfirm()
})
$(".alarm-history").click(getAlarmHistory)

var mGroupList;

function getGroupManagerList(type) {
    if (type == -1) {
        getGroupList()
    } else {
        $.get(url + "/api/groupList?" + country + "&part=" + type, function (res) {

            var string2 = ""
            let groupList = res.data
            console.log("grouplist")
            console.log(groupList)
            mGroupList = groupList
            groupList.forEach(item=> {
                    string2 += `
                   <tr id="g-list-${item.GroupID}">
                      <td>${item.GroupID}</td>
                      <td>${item.GroupName}</td>
                      <td>${types[item.Part]}</td>
                      <td>${item.CreateDate}</td>
                      <td>
                            <button data-toggle="modal" data-target="#group-setting" type="button" class="btn btn-default" data-name="${item.GroupName}"  data-part=${item.Part}  data-type="${types[item.Part]}" data-id="${item.ID}" data-gid="${item.GroupID}" >Edit</button>
                            <button data-toggle="modal" data-target="#group-del" type="button" class="btn btn-warning" data-name="${item.GroupName}"  data-part=${item.Part}  data-type="${types[item.Part]}" data-id="${item.GroupID}" >Del</button>
                      </td>

                  </tr>
                `
                }
            )
            $('.group-list').html(string2)
            $('.group-list tr').click(function () {
                let index = $(this).index()
                requestSensorByGroupId(groupList[index].GroupID, function (res) {

                })
            })
        })
    }
}


var getLiftContentByGroup = function (ID) {
    $('#loading').modal('show');
    getLift(ID);
    flowTimer2 = setInterval(function () {
        getLift(ID);
    }, 1000 * 10)
}
var getGasContentByGroup = function (ID) {
    getTolietRecord(ID)
}
let flowTimer2;
let waterTimer;
let powerTimer;
let liftTimer;
let toiletCsTimer;
var getFlowContentByGroup = function (ID) {
    $('#loading').modal('show');

    getAirFlow(ID);
    flowTimer2 = setInterval(function () {
        getAirFlow(ID);
    }, 1000 * 10)
}

var getWaterContentByGroup = function (ID) {
    getWaterMeterList(ID)
    waterTimer = setInterval(function () {
        getWaterMeterList(ID);
    }, 1000 * 10)
}
var getPowerContentByGroup = function (ID) {
    getPowerMeterList(ID);
    powerTimer = setInterval(function () {
        getPowerMeterList(ID);
    }, 1000 * 10)

}
var nowToiletID
var getToiletCsContentByGroup = function (ID) {
    nowToiletID = ID
    getTolietCs(ID)
    toiletCsTimer= setInterval(function(){
        getTolietCs(ID)
    },1000*10)
}
var getGroupList = function () {
    $.get(url + "/api/groupList?" + country, function (res) {
        var string1 = ""
        var string2 = ""
        let groupList = res.data
        mGroupList = groupList
        groupList.forEach(item=> {

                string1 += `

                <li>
                       <a href="#"><i class="glyphicon glyphicon-cog"></i><font
                       style="vertical-align: inherit;"><font style="vertical-align: inherit;">${item.GroupName}</font></font></a>
                 </li>
                `

                string2 += `
                   <tr id="g-list-${item.GroupID}">
                      <td>${item.GroupID}</td>
                      <td>${item.GroupName}</td>
                      <td>${types[item.Part]}</td>
                      <td>${item.CreateDate}</td>
                      <td>
                            <button data-toggle="modal" data-target="#group-setting" type="button" class="btn btn-default" data-name="${item.GroupName}"  data-part=${item.Part}  data-type="${types[item.Part]}" data-id="${item.ID}" data-gid="${item.GroupID}" >Edit</button>
                            <button data-toggle="modal" data-target="#group-del" type="button" class="btn btn-warning" data-name="${item.GroupName}"  data-part=${item.Part}  data-type="${types[item.Part]}" data-id="${item.GroupID}" data-gid="${item.GroupID}" >Del</button>
                      </td>

                  </tr>
                `
            }
        )

        $('.group-list').html(string2)
        $('#g-list').html(string1)
        $('.group-list tr').click(function () {
            let index = $(this).index()
            requestSensorByGroupId(groupList[index].GroupID, function (res) {

            })
        })
        $('#g-list li').click(function () {
            $(this).addClass("active").siblings().removeClass("active");
            var index = $(this).index()
            console.log(groupList[index])
            console.log("part", groupList[index].Part)
            clearInterval(flowTimer2)
            clearInterval(waterTimer)
            clearInterval(powerTimer)
            clearInterval(liftTimer)
            clearInterval(toiletCsTimer)

            switch (groupList[index].Part) {
                case 0:
                    console.log("走这了")
                    $(".tabcontent").removeClass("active");
                    $(".tabcontent").eq(3).addClass("active");
                    getLiftContentByGroup(groupList[index].GroupID)
                    break;
                case 1:

                    $(".tabcontent").removeClass("active");
                    $(".tabcontent").eq(4).addClass("active");
                    getGasContentByGroup(groupList[index].GroupID)

                    break;
                case 2:

                    $(".tabcontent").removeClass("active");
                    $(".tabcontent").eq(5).addClass("active");
                    getFlowContentByGroup(groupList[index].GroupID)

                    break;
                case 3:
                    $(".tabcontent").removeClass("active");
                    $(".tabcontent").eq(7).addClass("active");
                    getPowerContentByGroup(groupList[index].GroupID)

                    break;
                case 4:
                    $(".tabcontent").removeClass("active");
                    $(".tabcontent").eq(6).addClass("active");

                    getWaterContentByGroup(groupList[index].GroupID)

                    break

                case 5:
                    $(".tabcontent").removeClass("active");
                    $(".tabcontent").eq(8).addClass("active");
                    getToiletCsContentByGroup(groupList[index].GroupID)

                    break;
            }


        })

    })

}
// 水表历史纪录切换

var alarms;
var warns;
//获取警报
function getAlarms() {


    $.get(url + "/api/warn?status=0&" + country, function (res) {
        var stringWarn = ''
        if (res.data) {
            warns = res.data
            var five
            if(res.data.length>=3){
                 five = res.data.slice(0, 3)
            }else{
                 five = res.data
            }
            five.forEach((item, index)=> {
                    stringWarn += `<div class="orange">${index + 1}.${item.Comment}</div>`
                }
            )
            if(res.data.length>=3){
                stringWarn+= `<div  style="width: 100%;text-align: center;color:darkgray">See More</div>`
            }


        } else {
            stringWarn = `<div >暂无警报</div>`
        }
        $(".warn-content").html(stringWarn)
    })

    $.get(url + "/api/alarm?status=0&" + country, function (res) {
        var stringAlarm = ''
        if (res.data) {
            alarms = res.data
            var five
            if(res.data.length>=3){
                five = res.data.slice(0, 3)
            }else{
                five = res.data
            }
            five.forEach((item, index)=> {
                    stringAlarm += `<div class="red">${index + 1}.${item.Comment}</div>`
                }
            )
        } else {
            stringAlarm = `<div >暂无警报</div>`
        }
        if(res.data.length>=3){
            stringAlarm+= `<div  style="width: 100%;text-align: center;color:darkgray">See More</div>`
        }

        $(".alarm-content").html(stringAlarm)
    })

    $.get(url + "/api/alarmCount?" + country, function (res) {
        var count = 0;
        if (res.ret == 0) {
            count = res.data[0].AlarmCount

        }
        $(".alarm-count").html(``)
    })
}

function setSensorGroupZero(sensorId, groupid, id) {

    $.post(url + "/api/sensorset", {sId: sensorId, gId: id}, function (res) {
        requestSensorByGroupId(groupid, function () {
        })
    })
}

function getAlarmHistory() {
    $.get(url + "/api/alarm?" + country, function (res) {
        var string = "";
        res.data.forEach(item=> {
                string += `
        <div>> ${item.Comment}</div>
        `
            }
        )
        $(".alarm-history-list").html(string)
    })
}


function hideNav() {
    //if ($('body').hasClass('sidebar-collapse')) {
    //    $('body').removeClass('sidebar-collapse')
    //} else {
    //    $('body').addClass('sidebar-collapse')
    //}
    //
    //if ($('body').hasClass('sidebar-open')) {
    //    $('body').removeClass('sidebar-open')
    //} else {
    //    $('body').addClass('sidebar-open')
    //}
}
var noAskingLift = true
// 获取电梯数据
function getLift(id) {
    if (noAskingLift) {
        noAskingLift = false

        $.get(url + "/api/lift?" + country + "&gId=" + id, function (res) {
            $('#loading').modal('hide');
            noAskingLift = true
            console.log('lift2222')
            console.log(res)

            let liftIndex = ''
            for (var i = 0; i < res.data.length; i++) {
                var item = res.data[i]

                liftIndex += `
            <div class="box box-primary col-md-4 " style="width:auto;margin-right: 10px"  data-toggle="modal" data-target="#lift-data"  data-id="${res.data[i].ID}" data-name="${res.data[i].Comments}">
                    <!-- 电梯左侧数据展示 -->
                     <div class="box-header with-border">
                        <h3 class="box-title">${item.Comments}</h3>
                    </div>
                    <div class="box-body">
                      <div>Accelerometer(m/s2)</div>
                      <div class="row">
                        <div class="col-md-4">x<br/>${item == undefined ? "No Value" : item.AX}</div>
                        <div class="col-md-4">y<br/>${item == undefined ? "No Value" : item.AY}</div>
                        <div class="col-md-4">z<br/>${item == undefined ? "No Value" : item.AZ}</div>
                      </div>
                      <div>Agular Volocity(°/s)</div>
                      <div class="row">
                        <div class="col-md-4">x<br/>${item == undefined ? "No Value" : item.VX}</div>
                        <div class="col-md-4">y<br/>${item == undefined ? "No Value" : item.VY}</div>
                        <div class="col-md-4">z<br/>${item == undefined ? "No Value" : item.VZ}</div>
                      </div>
                      <div>Inclination(°)</div>
                      <div class="row">
                        <div class="col-md-4">x<br/>${item == undefined ? "No Value" : item.IX}</div>
                        <div class="col-md-4">y<br/>${item == undefined ? "No Value" : item.IY}</div>
                        <div class="col-md-4">z<br/>${item == undefined ? "No Value" : item.IZ}</div>
                      </div>
                   </div>
                </div>
            `
            }
            $("#liftLeft").html(liftIndex)

        })

    }
}
var toiletRecord;
//厕所历史
function getTolietRecord(ID) {
    $.get(url + "/api/gas" + "?" + country + "&gId=" + ID, function (res) {
        var string1 = ""
        toiletRecord = res.data
        for (var i in res.data) {
            let item = res.data[i]
            string1 += `
                <div class="col-md-3 item-gas" data-toggle="modal"
        data-target="#gas-history" data-index="${i}">
                  <div>
                    <h4>${item.Comments}</h4>
                  </div>
                  <div>H2S(ppm): ${item.His.length > 0 ? item.His[i].H2S : 'No Data'}</div>
                  <div>CH4(ppm): ${item.His.length > 0 ? item.His[i].CH4 : 'No Data'}</div>
             </div>
          `
        }

        $('.gas-content').html(string1)


    })
}

$('#gas-history').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var index = button.data('index')
    var string2;
    toiletRecord[index].His.forEach(item=> {
            string2 += `
                  <tr>
                    <td>${item.CreateDate}</td>
                    <td>${item.H2S}</td>
                    <td>${item.CH4}</td>
                  </tr>
                `
        }
    )
    $('.gas-history-list').html(string2)

})

function checkSB() {
    for (var i in checkArry) {
        console.log('#check' + checkArry[i])
        $('#check' + checkArry[i]).attr('checked', true)
    }

}
var toiletTypes = ["male", 'female', 'handcap', 'all']


//厕所报警
var getItemHis = function (item) {
    var string = ''
    if (item.His.length > 0) {
        item.His.forEach(ii=> {
            string += `
                  <tr>
                      <td>${toiletTypes[ii.ToiletType]}</td>
                      <td>${ii.Evaluate}</td>
                      <td>${ii.Fault}</td>
                      <td><button onclick="TolietCsComfirm(${ii.ID})">Confirm</button></td>
                  </tr>
                `
        })
    } else {
        string = "no fault"
    }

    return string
}
function getTolietCs(id) {
    $.get(url + "/api/toiletcs" + "?" + country + "&gId=" + id, function (res) {
        var s = ''
        res.data.forEach(item=> {
            s += `
            <div class="col-md-4">
                <div class="box box-primary">
                <div class="box-header with-border">
                <h3 class="box-title toilet-title">${item.Comments}</h3>

            <div>
                <table class="table">
                <thead>
                <tr>
                <th>Type</th>
                <th>Evaluate</th>
                <th>Fault</th>
                <th>Action</th>
                </tr>
                </thead>
                <tbody class="toilet-cs-tbody">`
                +
                getItemHis(item)

                + `

                </tbody>
                </table>

            </div>
            </div>

            </div>
            </div>
            `
        })
        $('.toilet-cs-content').html(s)


        checkSB()
    })

}
function TolietCsAdd(ID) {
    console.log(ID)
    var index = checkArry.indexOf(ID)
    if (index < 0) {
        checkArry.push(ID)
    } else {
        checkArry.splice(index, 1)
    }
    console.log(checkArry)
}

function TolietCsComfirm(ID) {
    //let string = ''
    //if (checkArry.length == 0) {
    //    return
    //} else {
    //    for (var i = 0; i < checkArry.length; i++) {
    //        string += checkArry[i] + ","
    //    }
    //}
    $.post(url + "/api/toilet/confirm?ids=" + ID + "&" + country, {}, function (res) {
        alert("success")
        getTolietCs(nowToiletID)
    })
}
//获取power meter list
function getPowerMeterList(ID) {
    $.get(url + "/api/power?" + country + "&gId=" + ID, function (res) {
        powerHistory = res.data
        let string = "";
        console.log(powerHistory)
        let listString = "";
        for (var i in powerHistory) {
            listString += `
              <tr class="mouse-on" title="click to change history">
                                        <td>${powerHistory[i].ID}</td>
                                        <td>${powerHistory[i].His[0] ? powerHistory[i].His[0].Reading : 'No Value'}</td>
                                        <td>` + powerHistory[i].Comments + `</td>
                                    </tr>
            `
        }

        $(".power-meter-list").html(listString)

        // 电表历史纪录切换
        $(".power-meter-list tr").click(function () {
            var index = $(this).index();
            var string = ""
            $(".power-meter-list").children("tr").css("background", "#ffffff")
            powerTag = index
            var date = new Date()

            getPowerMeter(date.getFullYear() + "-" + ((date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))) + "-" + (date.getDay() < 10 ? "0" + date.getDay() : date.getDay()), powerHistory[index].ID, powerHistory[index].Comments)

            $(this).css("background", "#cccccc")
            powerHistory[index].His.forEach(item=> {
                    string += `
                          <tr>
                            <td>${item.CreateDate}</td>
                            <td>${item.Reading}</td>
                          </tr>
                          `
                }
            )

            $(".power-meter-history").html(string)


        })

        $(".power-meter-history").html(string)
    })
}
//获取water meter list
function getWaterMeterList(ID) {
    $.get(url + "/api/water" + "?" + country + "&gId=" + ID, function (res) {
        waterHistory = res.data
        let string = "";
        let listString = "";
        for (var i in waterHistory) {
            listString += `
              <tr class="mouse-on" title="click to change history">
                                        <td>${waterHistory[i].ID}</td>
                                        <td>${waterHistory[i].His[0] ? waterHistory[i].His[0].CurrentVolum : 'No Value'}</td>
                                        <td>${waterHistory[i].His[0] ? waterHistory[i].His[0].InstantFlowRate : 'No Value'}</td>
                                        <td>` + waterHistory[i].Comments + `</td>
                                    </tr>
            `
        }

        $(".water-meter-list").html(listString)

        $(".water-meter-list tr").click(function () {
            var index = $(this).index();
            var string = ""
            $(".water-meter-list").children("tr").css("background", "#ffffff")
            waterTag = index
            var date = new Date()

            getWaterMeter(date.getFullYear() + "-" + ((date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))) + "-" + (date.getDay() < 10 ? "0" + date.getDay() : date.getDay()), waterHistory[index].ID, waterHistory[index].Comments)
            waterHistory[index].Comments
            $(this).css("background", "#cccccc")
            waterHistory[index].His.forEach(item=> {
                    string += `
                      <tr>
                        <td>${item.CreateDate}</td>
                        <td>${item.CurrentVolum}</td>
                        <td>${item.InstantFlowRate}</td>
                      </tr>
                      `
                }
            )
            $(".water-meter-history").html(string)
        })

        $(".water-meter-list").children('tr').css('background', '#ffffff');
        $(".water-meter-list").find("tr:eq(" + waterTag + ")").css('background', "#cccccc");

        waterHistory[waterTag].His.forEach(item=> {
                string += `
          <tr>
            <td>${item.CreateDate}</td>
            <td>${item.CurrentVolum}</td>
            <td>${item.InstantFlowRate}</td>
          </tr>
          `
            }
        )
        $(".water-meter-history").html(string)
    })
}
//图谱绘制
function getAirFlow(gId) {
    $.get(url + "/api/flow" + "?" + country + "&gId=" + gId, function (res) {
        $('#loading').modal('hide');

        var s = ''
        var ids = []
        for (var i in res.data) {
            s += `
                <div class="row col-md-2 air-flow-block" data-toggle="modal" data-target="#flow-data"  data-id="${res.data[i].ID}" data-name="${res.data[i].Comments}" >
                    <div class="width:100%">
                    <div style="font-size :18px;font-weight: 300">${res.data[i].Comments}</div>
                    <div style="width:100%">
                        <div style="font-size: 10px" class="flow-this-time">${res.data[i].CreateDate ? res.data[i].CreateDate.substring(5, 19).replace("T", " ") : 'no record'}</div>
                        <span class="air-flow-num" style="width: 100%;;text-align: center"> ${res.data[i].AirFlowSpeed ? res.data[i].AirFlowSpeed : 'Offline'}</span></div>
                    </div>
                    </div>
                  `
        }

        $('.air-flow-body').html(s)


    })
}


$('.group-un').click(function () {

    if (mChooseConfig == 0) {
        mChooseConfig = 1
        $('.group-un').text('All')
    } else {
        mChooseConfig = 0
        $('.group-un').text('Group Unconfigured')
    }
    getSensors()

})


$("#s-g-id-con").click(function () {
    mChooseType = 7
    mChooseConfig = 0
    $('#type-choose').text('All')
    $('.group-un').text('Group Unconfigured')

    requestSensorByGroupIdOrLocation($('#btn-sensor-search').val(), function (res) {
        generateSensors(res.data)
    });
})

//获得sensor列表
function getSensors() {
    $.get(url + "/api/sensors?" + ((mChooseType == 7 || mChooseType == 6) ? '' : 'part=' + mChooseType + '&') + (mChooseConfig == 0 ? "" : "gId=0") + "&" + country, function (res) {
        generateSensors(res.data)

    })
}

$('#sensor-del').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var name = button.data('name')
    var id = button.data('id')
    var type = button.data('type')
    var hard = button.data('hard')
    var gId = button.data('gid')

    var modal = $(this)

    modal.find('.del-s-name').text(name)
    modal.find('.del-s-type').text(type)
    modal.find('.del-s-location').text(hard)
    modal.find('#sensor-del-confirm').unbind()
    modal.find('#sensor-del-confirm').click(function () {
        setSensorGroupZero(id, gId, 0)
    })
})


$('#lift-data').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id')
    var name = button.data('name')

    var modal = $(this)
    modal.find("#lift-data-t").text(name)
    queryLiftData(id)

    LiftDataTimer = setInterval(function () {
        queryLiftData(id)
    }, 5000)

})

$('#lift-data').on('hide.bs.modal', function (event) {
    console.log("走这了2")
    clearInterval(LiftDataTimer)
})

var LiftDataTimer;
function queryLiftData(id) {
    $.get(url + "/api/liftSingleData?id=" + id, function (res) {
        if (res.data.length > 0) {
            let string3 = ""
            var his = res.data

            for (var i = 0; i < res.data.length; i++) {

                string3 += `
                  <tr>
                      <td>${his[i].CreateDate.substring(5, 19).replace("T", " ")}</td>
                      <td>${his[i].AX}|${his[i].AY}|${his[i].AZ}</td>
                      <td>${his[i].VX}|${his[i].VY}|${his[i].VZ}</td>
                      <td>${his[i].IX}|${his[i].IY}|${his[i].IZ}</td>
                  </tr>
                `
            }
            $(".lift-data-list").html(string3)

        } else {

            $(".box-lift-title").text("No Record")
            $(".lift-data-list").html("")

        }

    })
}


$('#flow-data').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id')
    var name = button.data('name')

    var modal = $(this)
    modal.find("#flows-data-t").text(name)
    queryFlowData(id)
    console.log("走这了1")

    flowDataTimer = setInterval(function () {
        queryFlowData(id)
    }, 5000)

})

$('#flow-data').on('hide.bs.modal', function (event) {
    console.log("走这了2")
    clearInterval(flowDataTimer)
})

var flowDataTimer;
function queryFlowData(id) {
    $.get(url + "/api/flowSingleData?id=" + id, function (res) {
        var a = {}
        a.graphData = [];
        a.graphLabels = []
        res.data.forEach(it=> {
            a.graphData.push(it.AirFlowSpeed);
            a.graphLabels.push(it.CreateDate.substring(5, 19).replace("T", " "))
        })
        drawFlowCharts(a)
    })
}


$('#group-del').on('show.bs.modal', function (event) {
    var isclikck = false
    var button = $(event.relatedTarget) // Button that triggered the modal
    var name = button.data('name')
    var id = button.data('id')
    var type = button.data('type')
    var modal = $(this)
    console.log('id')

    console.log(id)

    modal.find('.del-g-name').text(name)
    modal.find('.del-g-type').text(type)
    modal.find('#group-del-confirm').unbind()

    modal.find('#group-del-confirm').click(function () {
        $.post(url + "/api/delGroup", {'id': id,'cId':countryId}, function (res) {
            console.log(res)
            if (res.ret == 0) {
                getGroupList()
            } else {
                alert(res.message)
            }
        })
    })
})


$('#group-setting').on('show.bs.modal', function (event) {

    var button = $(event.relatedTarget) // Button that triggered the modal
    var part = button.data('part')
    var name = button.data('name')
    var id = button.data('id')
    var gId = button.data('gid')
    var type = button.data('type')
    var modal = $(this)
    var s1 = ''
    var gl = ''
    var mType = -1;
    typesSingle.forEach(item=> {
        gl += `<li><a href="#">${item}</a></li>`
    })
    if (id == -1) {
        modal.find('#group-setting-title-t').text('New Group!')
        s1 = `<button type="button" class="btn btn-default dropdown-toggle"
        data-toggle="dropdown">
            选择 <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu">
            </ul>
            <h5 class="gp-name-ch col-md-2"></h5>
            `
        modal.find('.btn-group').html(s1)
        modal.find('.dropdown-menu').html(gl)
        $('.dropdown-menu li').click(function () {
            modal.find('.gp-name-ch').text(typesSingle[$(this).index()])
            mType = $(this).index()
        })
        modal.find('#group-id-input').val("")

        modal.find('#group-name-input').val('');

    } else {
        modal.find('#group-setting-title-t').text('Group Setting for ' + name)
        s1 = ` <h5 class="group-name-has">${type}</h5>
            `
        modal.find('.text-ch').html('sensor type')
        modal.find('#group-id-input').val(gId)
        modal.find('.btn-group').html(s1)
        modal.find('#group-name-input').val(name);
        mType = part

    }
    modal.find('#group-setting-confirm').unbind()
    modal.find('#group-setting-confirm').click(function () {
        if (modal.find('#group-name-input').val().length && modal.find('#group-id-input').val().length && mType != -1) {
            if (id == -1) {
                $.post(url + '/api/addGroup', {
                    'gName': modal.find('#group-name-input').val(),
                    'part': mType,
                    'cId': getUrlParam("cId") ? getUrlParam("cId") : "9999",
                    'gId': modal.find('#group-id-input').val()
                }, function (res) {
                    getGroupList()
                    mType = -1
                })
            } else {
                $.post(url + '/api/updateGroup', {
                    'gName': modal.find('#group-name-input').val(),
                    'id': id,
                    'gId': modal.find('#group-id-input').val()
                }, function (res) {
                    getGroupList()
                    mType = -1
                })
            }
        } else {
            alert("请填写完整信息")
            return false
        }


    })


})


$('#myModal-history').on('show.bs.modal', function (event) {

    var button = $(event.relatedTarget) // Button that triggered the modal
    var type = button.data('type')
    var modal = $(this)
    var s = ''
    var datas;
    switch (type) {
        case 0:
            modal.find('#label').text("Warn")
            datas = warns
            break
        case 1:
            modal.find('#label').text("Alarm")
            datas = alarms
            break
    }

    datas.forEach((item, index)=> {
        s += `<div>${index + 1}.${item.Comment}</div>`
    })
    console.log('datas')
    console.log(s)

    console.log(datas)
    modal.find('.alarm-history-list').html(s)


})


$('#sensors-picker-setting').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var part = button.data('part')
    var name = button.data('name')
    var sId = button.data('sid')
    var sTime = button.data('time')
    var alarms = button.data('alarms')
    var emails = button.data('emails')
    var gId = button.data('gid')
    // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)

    modal.find('.modal-title').text("Setting for " + name)
    var gl = ''
    var gpll = mGroupList.filter(function (item) {
        return item.Part == part
    })
    var chooseGroupID = 0
    console.log('item.GroupID')
    console.log(gId)
    console.log(gpll)
    gpll.forEach(item=> {
        console.log(item.GroupID)
        console.log(gId)

        if (item.GroupID == gId) {
            modal.find('.sensor-gp-name-ch').text(item.GroupName)
        }
        gl += `<li><a href="#">${item.GroupName}</a></li>`
    })
    if (gId == 0) {
        modal.find('.sensor-gp-name-ch').text('')
    }
    let mails = emails.split('-')
    if (mails[0] != 'null') {
        modal.find('#email-1').val(mails[0])
    }
    if (mails[1] != 'null') {
        modal.find('#email-2').val(mails[1])
    }
    if (mails[2] != 'null') {
        modal.find('#email-3').val(mails[2])
    }

    modal.find('.dropdown-menu').html(gl)
    $('.dropdown-menu li').click(function () {
        modal.find('.sensor-gp-name-ch').text(gpll[$(this).index()].GroupName)
        chooseGroupID = gpll[$(this).index()].GroupID
    })


    var s = `  <div> </div>  `
    var flowDiv = editDiv.flowDiv
    var gasDiv = editDiv.gasDiv
    var liftDiv = editDiv.liftDiv
    var time = editDiv.time


    switch (part) {
        case 0:
            modal.find('.modal-body-1').html(liftDiv)
            modal.find('.modal-alarm-time').html(time)
            let liftt1 = alarms.split('-');
            let liftAalrms = []
            for (var i = 0; i < liftt1.length; i++) {
                liftAalrms[i] = liftt1[i].split(";")
                if (liftAalrms[i].length == 9) {
                    switch (i) {
                        case 0:
                            liftAalrms.forEach(item=> {

                                console.log(item[0])
                                $('#l-ac-x-c-r').val(item[0])
                                $('#l-ac-y-c-r').val(item[1])
                                $('#l-ac-z-c-r').val(item[2])
                                $('#l-au-x-c-r').val(item[3])
                                $('#l-au-y-c-r').val(item[4])
                                $('#l-au-z-c-r').val(item[5])
                                $('#l-in-x-c-r').val(item[6])
                                $('#l-in-y-c-r').val(item[7])
                                $('#l-in-z-c-r').val(item[8])
                            })
                            break
                        case 1:
                            liftAalrms.forEach(item=> {
                                $('#l-ac-x-c-p').val(item[0])
                                $('#l-ac-y-c-p').val(item[1])
                                $('#l-ac-z-c-p').val(item[2])
                                $('#l-au-x-c-p').val(item[3])
                                $('#l-au-y-c-p').val(item[4])
                                $('#l-au-z-c-p').val(item[5])
                                $('#l-in-x-c-p').val(item[6])
                                $('#l-in-y-c-p').val(item[7])
                                $('#l-in-z-c-p').val(item[8])
                            })
                            break
                        case 2:
                            liftAalrms.forEach(item=> {
                                $('#l-ac-x-f-r').val(item[0])
                                $('#l-ac-y-f-r').val(item[1])
                                $('#l-ac-z-f-r').val(item[2])
                                $('#l-au-x-f-r').val(item[3])
                                $('#l-au-y-f-r').val(item[4])
                                $('#l-au-z-f-r').val(item[5])
                                $('#l-in-x-f-r').val(item[6])
                                $('#l-in-y-f-r').val(item[7])
                                $('#l-in-z-f-r').val(item[8])
                            })

                            break
                        case 3:
                            liftAalrms.forEach(item=> {
                                $('#l-ac-x-f-p').val(item[0])
                                $('#l-ac-y-f-p').val(item[1])
                                $('#l-ac-z-f-p').val(item[2])
                                $('#l-au-x-f-p').val(item[3])
                                $('#l-au-y-f-p').val(item[4])
                                $('#l-au-z-f-p').val(item[5])
                                $('#l-in-x-f-p').val(item[6])
                                $('#l-in-y-f-p').val(item[7])
                                $('#l-in-z-f-p').val(item[8])
                            })
                            break
                    }
                }
            }

            break
        case 1:
            modal.find('.modal-body-1').html(gasDiv)
            modal.find('.modal-alarm-time').html(time)


            let gast1 = alarms.split('-');
            let gasAalrms = []
            for (var i = 0; i < gast1.length; i++) {
                gasAalrms[i] = gast1[i].split(";")
                if (gasAalrms[i].length == 2) {
                    switch (i) {
                        case 0:
                            gasAalrms.forEach(item=> {

                                console.log(item[0])
                                $('#g-h-c-r').val(item[0])
                                $('#g-c-c-r').val(item[1])
                            })
                            break
                        case 1:
                            gasAalrms.forEach(item=> {
                                $('#g-h-c-p').val(item[0])
                                $('#g-c-c-p').val(item[1])
                            })
                            break
                        case 2:
                            gasAalrms.forEach(item=> {
                                $('#g-h-f-r').val(item[0])
                                $('#g-c-f-r').val(item[1])
                            })

                            break
                        case 3:
                            gasAalrms.forEach(item=> {
                                $('#g-h-f-p').val(item[0])
                                $('#g-c-f-p').val(item[1])
                            })
                            break
                    }
                }
            }

            break
        case 2:
            modal.find('.modal-body-1').html(flowDiv)
            modal.find('.modal-alarm-time').html(time)


            let flowt1 = alarms.split('-');
            let flowAalrms = []
            for (var i = 0; i < flowt1.length; i++) {
                flowAalrms[i] = flowt1[i].split(";")
                if (flowAalrms[i].length == 1) {
                    switch (i) {
                        case 0:
                            flowAalrms.forEach(item=> {

                                $('#f-c-r').val(item[0])
                            })
                            break
                        case 1:
                            flowAalrms.forEach(item=> {
                                $('#f-c-p').val(item[0])

                            })
                            break
                        case 2:
                            flowAalrms.forEach(item=> {
                                $('#f-f-r').val(item[0])

                            })

                            break
                        case 3:
                            flowAalrms.forEach(item=> {
                                $('#f-f-p').val(item[0])

                            })
                            break
                    }
                }
            }
            break
        default :
            modal.find('.modal-body-1').html(s)
            modal.find('.modal-alarm-time').html(s)
            modal.find('.modal-body-1-t').html(s)
    }


    //modal.find('a').attr('style','width:40px;display:block')
    let tempTimes = sTime.split('-');

    for (var i in tempTimes) {
        if (tempTimes[i] != null) {
            let kk = tempTimes[i].split(':')
            switch (i) {
                case '0':
                    $('#alarm-s-t-h').val(kk[0])
                    $('#alarm-s-t-m').val(kk[1])
                    break
                case '1':
                    $('#alarm-e-t-h').val(kk[0])
                    $('#alarm-e-t-m').val(kk[1])
                    break
            }

        }
    }
    tempTimes.forEach(item=> {
        if (item != 'null') {
            let kk = item.split(':')

        }
    })
    $("#alarm-setting-confirm").unbind()
    $("#alarm-setting-confirm").click(function () {
        switch (part) {
            case 0:


                var atr = getNotNullNumber($('#l-ac-x-c-p').val()) + ";" + getNotNullNumber($('#l-ac-y-c-p').val()) + ";" + getNotNullNumber($('#l-ac-z-c-p').val()) + ";"
                    + getNotNullNumber($('#l-au-x-c-p').val()) + ";" + getNotNullNumber($('#l-au-y-c-p').val()) + ";" + getNotNullNumber($('#l-au-z-c-p').val()) + ";"
                    + getNotNullNumber($('#l-in-x-c-p').val()) + ";" + getNotNullNumber($('#l-in-y-c-p').val()) + ";" + getNotNullNumber($('#l-in-z-c-p').val())

                var at = getNotNullNumber($('#l-ac-x-c-r').val()) + ";" + getNotNullNumber($('#l-ac-y-c-r').val()) + ";" + getNotNullNumber($('#l-ac-z-c-r').val()) + ";"
                    + getNotNullNumber($('#l-au-x-c-r').val()) + ";" + getNotNullNumber($('#l-au-y-c-r').val()) + ";" + getNotNullNumber($('#l-au-z-c-r').val()) + ";"
                    + getNotNullNumber($('#l-in-x-c-r').val()) + ";" + getNotNullNumber($('#l-in-y-c-r').val()) + ";" + getNotNullNumber($('#l-in-z-c-r').val())

                var ab = getNotNullNumber($('#l-ac-x-f-r').val()) + ";" + getNotNullNumber($('#l-ac-y-f-r').val()) + ";" + getNotNullNumber($('#l-ac-z-f-r').val()) + ";"
                    + getNotNullNumber($('#l-au-x-f-r').val()) + ";" + getNotNullNumber($('#l-au-y-f-r').val()) + ";" + getNotNullNumber($('#l-au-z-f-r').val()) + ";"
                    + getNotNullNumber($('#l-in-x-f-r').val()) + ";" + getNotNullNumber($('#l-in-y-f-r').val()) + ";" + getNotNullNumber($('#l-in-z-f-r').val())

                var abr = getNotNullNumber($('#l-ac-x-f-p').val()) + ";" + getNotNullNumber($('#l-ac-y-f-p').val()) + ";" + getNotNullNumber($('#l-ac-z-f-p').val()) + ";"
                    + getNotNullNumber($('#l-au-x-f-p').val()) + ";" + getNotNullNumber($('#l-au-y-f-p').val()) + ";" + getNotNullNumber($('#l-au-z-f-p').val()) + ";"
                    + getNotNullNumber($('#l-in-x-f-p').val()) + ";" + getNotNullNumber($('#l-in-y-f-p').val()) + ";" + getNotNullNumber($('#l-in-z-f-p').val())

                var tStart = getNotNullNumber($('#alarm-s-t-h').val()) + ":" + getNotNullNumber($('#alarm-s-t-m').val())
                var tEnd = getNotNullNumber($('#alarm-e-t-h').val()) + ":" + getNotNullNumber($('#alarm-e-t-m').val())

                var email1 = $('#email1').val()
                var email2 = $('#email2').val()
                var email3 = $('#email3').val()

                $.post(url + "/api/updateSensor", {
                    "ids": sId,
                    "gId": chooseGroupID,
                    "alarmT": at,
                    "alarmTR": atr,
                    "alarmB": ab,
                    "alarmBR": abr,
                    "alarmStartTime": tStart,
                    "alarmEndTime": tEnd,
                    "postAddress1": email1,
                    "postAddress2": email2,
                    "postAddrees3": email3
                }, function (res) {
                    getSensors()

                    if (res.ret == 0) {
                    }
                })

                break
            case 1:
                var at = getNotNullNumber($('#g-h-c-r').val()) + ";" + getNotNullNumber($('#g-c-c-r').val())

                var atr = getNotNullNumber($('#g-h-c-p').val()) + ";" + getNotNullNumber($('#g-c-c-p').val())


                var ab = getNotNullNumber($('#g-h-f-r').val()) + ";" + getNotNullNumber($('#g-c-f-r').val())

                var abr = getNotNullNumber($('#g-h-f-p').val()) + ";" + getNotNullNumber($('#g-c-f-p').val())

                var tStart = getNotNullNumber($('#alarm-s-t-h').val()) + ":" + getNotNullNumber($('#alarm-s-t-m').val())
                var tEnd = getNotNullNumber($('#alarm-e-t-h').val()) + ":" + getNotNullNumber($('#alarm-e-t-m').val())

                var email1 = $('#email1').val()
                var email2 = $('#email2').val()
                var email3 = $('#email3').val()
                $.post(url + "/api/updateSensor", {
                    "ids": sId,
                    "gId": chooseGroupID,
                    "alarmT": at,
                    "alarmTR": atr,
                    "alarmB": ab,
                    "alarmBR": abr,
                    "alarmStartTime": tStart,
                    "alarmEndTime": tEnd,
                    "postAddress1": email1,
                    "postAddress2": email2,
                    "postAddrees3": email3
                }, function (res) {
                    getSensors()

                    if (res.ret == 0) {
                    }
                })

                break
            case 2:
                var at = getNotNullNumber($('#f-c-r').val())

                var atr = getNotNullNumber($('#f-c-p').val())


                var ab = getNotNullNumber($('#f-f-r').val())

                var abr = getNotNullNumber($('#f-f-p').val())

                var tStart = getNotNullNumber($('#alarm-s-t-h').val()) + ":" + getNotNullNumber($('#alarm-s-t-m').val())
                var tEnd = getNotNullNumber($('#alarm-e-t-h').val()) + ":" + getNotNullNumber($('#alarm-e-t-m').val())

                var email1 = $('#email1').val()
                var email2 = $('#email2').val()
                var email3 = $('#email3').val()
                $.post(url + "/api/updateSensor", {
                    "ids": sId,
                    "gId": chooseGroupID,
                    "alarmT": at,
                    "alarmTR": atr,
                    "alarmB": ab,
                    "alarmBR": abr,
                    "alarmStartTime": tStart,
                    "alarmEndTime": tEnd,
                    "postAddress1": email1,
                    "postAddress2": email2,
                    "postAddrees3": email3
                }, function (res) {
                    getSensors()

                    if (res.ret == 0) {
                    }
                })
                break
            default :
                var email1 = $('#email1').val()
                var email2 = $('#email2').val()
                var email3 = $('#email3').val()

                $.post(url + "/api/updateSensor", {
                    "ids": sId,
                    "gId": chooseGroupID,
                    "alarmT": '',
                    "alarmTR": '',
                    "alarmB": '',
                    "alarmBR": '',
                    "alarmStartTime": '',
                    "alarmEndTime": '',
                    "postAddress1": email1,
                    "postAddress2": email2,
                    "postAddrees3": email3
                }, function (res) {
                    getSensors()

                    if (res.ret == 0) {
                    }
                })

        }
    })


})

function getNotNullNumber(a) {
    console.log("a" + a)
    a = (a == null || a == undefined || a == "") ? "0" : a
    a = checkRate(a) ? a : "0"
    return a
}

function checkRate(number) {
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
    if (!re.test(number)) {
        alert("please type in number");
        return false;
    } else {
        return true
    }
}


function generateSensors(sensors) {

    var s1 = ""
    sensors.forEach(item=> {
        s1 += `
              <tr>
                <!--<td><label>-->
                  <!--<input class="check-item" type="checkbox">-->
                <!--</label>-->
                <!--</td>-->
                <td>${item.ID}</td>
                <td>${item.Comments}</td>
                <td>
                    <!--<div href="#" class="aaaa" data-toggle="popover"-->
                    <div id='sensor${item.ID}add0'>T:${item.AlarmT == null ? 'Unconfigured' : item.AlarmT}</div>
                    <div id='sensor${item.ID}add0'>TR:${item.AlarmTR == null ? 'Unconfigured' : item.AlarmTR}</div>
                    <div id='sensor${item.ID}add1'>B:${item.AlarmB == null ? 'Unconfigured' : item.AlarmB}</div>
                    <div id='sensor${item.ID}add2'>BR:${item.AlarmBR == null ? 'Unconfigured' : item.AlarmBR}</div>
                 </td>
                 <td>${item.AlarmStartTime == null ? 'Unconfigured' : item.AlarmStartTime}</td>
                 <td>${item.AlarmEndTime == null ? 'Unconfigured' : item.AlarmEndTime}</td>
                 <td>
                    <div id='sensor${item.ID}add0'>①${item.PostAddress1 == null ? 'Unconfigured' : item.PostAddress1}</div>
                    <div id='sensor${item.ID}add1'>②${item.PostAddress2 == null ? 'Unconfigured' : item.PostAddress2}</div>
                    <div id='sensor${item.ID}add2'>③${item.PostAddress3 == null ? 'Unconfigured' : item.PostAddress3}</div>
                 </td>
                 <td>${item.Location}</td>
                 <td>${item.GroupID == 0 ? "Unconfigured" : item.GroupID}</td>
                 <td>${item.CreateDate}</td>
                 <td>
                 <button data-toggle="modal" data-target="#sensors-picker-setting" type="button" class="btn btn-default" data-gid="${item.GroupID}" data-name="${item.Comments}"  data-part="${item.Part}" data-alarms="${item.AlarmT}-${item.AlarmTR}-${item.AlarmB}-${item.AlarmBR}" data-time="${item.AlarmStartTime}-${item.AlarmEndTime}" data-emails="${item.PostAddress1}-${item.PostAddress2}-${item.PostAddress3}" data-sid="${item.ID}" >Edit</button>
                 </tr>
            `

    })


    $('.sensor-list').html(s1)
    checkfresh()
    $('.all-checked').on('ifChecked', function (event) {
        $('input:checkbox').iCheck('check');
    })

    $('.all-checked').on('ifUnchecked', function (event) {
        $('input:checkbox').iCheck('uncheck');
    })
    $('input:checkbox').on('ifChecked', function (event) {
        console.log(event.type)


    })

    $(".aaaa").popover({
        trigger: 'manual',
        placement: 'bottom', //placement of the popover. also can use top, bottom, left or right
        title: '<div style="text-align:center; color:red; text-decoration:underline; font-size:14px;">alarms</div>', //this is the top title bar of the popover. add some basic css
        html: 'true', //needed to show html of course
        content: '<div id="popOverBox"></div>', //this is the content of the html box. add the image here or anything you want really.
        animation: false
    }).on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(this).siblings(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide")
            }
        }, 100);
    });

}


function getWaterMeter(other, senserId, sensorName) {

    $.get(url + "/api/getMonthWater?other=" + other + "&id=" + senserId + "&" + country, function (res) {
        drawWaterCharts(other, sensorName, res.data)
    })
}

function getPowerMeter(other, senserId, sensorName) {
    $.get(url + "/api/getMonthPower?other=" + other + "&id=" + senserId + "&" + country, function (res) {
        drawPowerCharts(other, sensorName, res.data)
    })
}

function requestSensorByGroupId(groupId, fun) {
    $.get(url + "/api/sensorsByGroup?groupid=" + groupId + "&" + country, function (res) {
        var s = ""
        res.data.forEach(item=> {
            s += `
                       <tr>
                          <td>${item.ID}</td>
                          <!--<td>${item.HardWareSensorID}</td>-->
                          <td>${item.Comments}</td>
                          <td>${item.GroupID}</td>
                          <!--<td>${item.CreateDate}</td>-->
                          <td>
                               <button data-toggle="modal" data-target="#sensor-del" type="button" class="btn btn-warning" data-hard="${item.HardWareSensorID}" data-name="${item.Comments}" data-part=${item.Part}  data-type="${types[item.Part]}" data-gid="${item.GroupID}" data-id="${item.ID}" >Del</button>
                          </td>

                      </tr>
                `
        })

        $('.group-sensor-list').html(s)

    })

}

function getAlarmConfig() {
    $.get(url + "/api/alarm/config?" + country, function (res) {
        console.log(res)
        if (res.data) {
            alarmRightNow = "Air Flow Speed Alarm Right Now: Floor is " + res.data.FloorValue + " and ceiling is " + res.data.CeilingValue + "."
            $('.alarm-setting-right-now').html(alarmRightNow)
        }

    })
}

// 初始化图谱


var ctx4 = document.getElementById("pie-chart-main-all-numbers").getContext('2d')

var ctxpie0 = document.getElementById("pie-0").getContext('2d')
var ctxpie1 = document.getElementById("pie-1").getContext('2d')
var ctxpie2 = document.getElementById("pie-2").getContext('2d')
var ctxpie3 = document.getElementById("pie-3").getContext('2d')
var ctxpie4 = document.getElementById("pie-4").getContext('2d')
var ctxpie5 = document.getElementById("pie-5").getContext('2d')
function drawPieChart(res1, res2, bgColor) {
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        pointDot: false,
        animation: false
    }

    var piechar = new Chart(ctx4, {
        type: "pie",
        data: {
            labels: typesSingle,
            datasets: [
                {
                    backgroundColor: bgColor,
                    data: res1
                }
            ]
        },
        options: options
    });
    console.log(res1)

    console.log(res2[0].labers)

    var piechar00 = new Chart(ctxpie0, {
        type: "pie",
        data: {
            labels: res2[0].labers,
            datasets: [
                {
                    backgroundColor: res2[0].color,
                    data: res2[0].data
                }
            ]
        },
        options: options
    });
    var piechar01 = new Chart(ctxpie1, {
        type: "pie",
        data: {
            labels: res2[1].labers,
            datasets: [
                {
                    backgroundColor: res2[1].color,
                    data: res2[1].data
                }
            ]
        },
        options: options
    });
    var piechar02 = new Chart(ctxpie2, {
        type: "pie",
        data: {
            labels: res2[2].labers,
            datasets: [
                {
                    backgroundColor: res2[2].color,
                    data: res2[2].data
                }
            ]
        },
        options: options
    });
    var piechar03 = new Chart(ctxpie3, {
        type: "pie",
        data: {
            labels: res2[3].labers,
            datasets: [
                {
                    backgroundColor: res2[3].color,
                    data: res2[3].data
                }
            ]
        },
        options: options
    });
    var piechar04 = new Chart(ctxpie4, {
        type: "pie",
        data: {
            labels: res2[4].labers,
            datasets: [
                {
                    backgroundColor: res2[4].color,
                    data: res2[4].data
                }
            ]
        },
        options: options
    });
    var piechar05 = new Chart(ctxpie5, {
        type: "pie",
        data: {
            labels: res2[5].labers,
            datasets: [
                {
                    backgroundColor: res2[5].color,
                    data: res2[5].data
                }
            ]
        },
        options: options
    });


}

function bg() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ',' + g + ',' + b + ")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}


function drawFlowCharts(res) {
    console.log(res)
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        pointDot: false,
        animation: false
    }

    let ctx = document.getElementById("windChartAny").getContext("2d")

    let data = {
        labels: res.graphLabels,
        datasets: [
            {
                label: "data",
                borderColor: "#CD4F39",
                pointRadius: 0,
                data: res.graphData
            }
        ]
    }

    var myNewChart1 = new Chart(ctx, {
        type: "line",
        data: data,
        options: options
    });


}

waterCtx = document.getElementById("WaterMChart").getContext("2d")
powerCtx = document.getElementById("PowerMChart").getContext("2d")


function drawWaterCharts(other, id, res) {
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        pointDot: false,
        animation: false
    }
    let labels = []
    let data = []
    for (var i in res) {
        if (other.length == 4) {
            labels.push(res[i].DateTime)

        } else {
            labels.push(res[i].DateTime.substring(5))
        }
        data.push(res[i].DateValue)
    }
    var title = ""
    console.log(other)

    if (other.length == 4) {
        title = other + " " + id + " Data"
    } else if (other.length == 10) {

        title = other.substring(0, 7) + " " + id + " Data"
    } else {

        title = other + " " + id + " Data"

    }
    if (waterChart) {
        waterChart.destroy()
    }
    waterChart = new Chart(waterCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: title,
                    pointRadius: 0,
                    data: data
                }]
        },
        options: options
    });
}
var waterChart;
var powerChart;

function drawPowerCharts(other, id, res) {
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        pointDot: false,
        animation: false
    }
    let labels = []
    let data = []
    for (var i in res) {
        if (other.length == 4) {
            labels.push(res[i].DateTime)

        } else {
            labels.push(res[i].DateTime.substring(5))
        }
        data.push(res[i].DateValue)
    }
    var title = ""
    if (other.length == 4) {
        title = other + " " + id + " Data"
    } else if (other.length == 10) {

        title = other.substring(0, 7) + " " + id + " Data"
    } else {
        title = other + " " + id + " Data"

    }
    if (powerChart) {
        powerChart.destroy()
    }
    powerChart = new Chart(powerCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: title,
                    pointRadius: 0,
                    data: data
                }]
        },
        options: options
    });
}