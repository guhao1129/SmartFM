/**
 * Created by Duke on 2019/5/11.
 */

//const url = "http://111.231.55.121:8089";
const url = "http://localhost:8089";

// 初始化页面
/**
 * 获取组列表
 */
$(document).ready(function () {
    getCountries();
    console.log("欧式试试")
    getSensorCount(-1)
})
let typesSingle = ["Lift Sensor", "Gas Sensor", "Flow Sensor", "Power Meter", "Water Meter", "ToiletCs"]

function getSensorCount(countryId) {

    $.get(url + '/api/getSensorCount' + (countryId == -1 ? '' : '?cId=' + countryId), function (res) {
        var s = ''
        var total = 0
        var totalOnline = 0
        res.data.forEach(item=>{
            s+=`
                    <tr>
                          <td style="position: relative">
                               ${typesSingle[item.Part]}
                           </td>
                            <td style="position: relative">
                               ${item.sensorCount}
                           </td>
                            <td style="position: relative">
                               ${item.onlineCount}
                           </td>
                    </tr>
               `
            total+=item.sensorCount
            totalOnline+=item.onlineCount
        })
        s+=`
                    <tr style="font-weight: bold">
                          <td style="position: relative">
                               Total
                           </td>
                            <td style="position: relative">
                               ${total}
                           </td>
                            <td style="position: relative">
                               ${totalOnline}
                           </td>
                    </tr>
               `

        $('.tbody').html(s)
    })


}


$('.all').click(function(){
    $('.country-name').text("All")
    $('.country-zone').text("All")
    $('.country-address').text("All")
    getSensorCount(-1);
})

var mCountries  = []
var getCountries = function () {
    $.get(url + '/api/countries', function (res) {
        if (res.ret == 0) {
            var s1 = ""
            mCountries = res.data
            for (var i in res.data) {
                var item = res.data[i]
                s1 += `
                    <tr>
                          <td style="position: relative">

                                <div type="button" class="toiletcs-button"  style="display: flex;flex-direction: row">
                                    <div>
                                        <div style="color:firebrick;font-weight: bold">
                                           ${item.HawkerCentre}
                                        </div>

                                        <div style="width: 260px">
                                          Address:  ${item.Address}
                                        </div>
                                     </div>
                                          <div class="go" style="margin: auto;color: blue;font-weight: bold;cursor: pointer;">
                                            Go
                                     </div>
                                </div>


                           </td>
                        </tr>
                    `

            }
            $("#buttons").html(s1)
            $("#buttons .go").click(function () {
                var index = $(this).closest("tr").index()
                console.log(index)
                window.location.href = url + "/starter.html?cId=" + res.data[index].CountryID + "&cName=" + res.data[index].HawkerCentre + "&cAddr=" + res.data[index].Address;
            })

            $("#buttons .toiletcs-button").click(function () {
                var index = $(this).closest("tr").index()
                $('.country-name').text(res.data[index].HawkerCentre)
                $('.country-zone').text(res.data[index].Zone)
                $('.country-address').text(res.data[index].Address)


                console.log(index)
                getSensorCount(res.data[index].CountryID)
            })
        }
    })
}
