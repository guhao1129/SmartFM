/**
 * Created by Duke on 2019/5/11.
 */
/**
 * Created by Duke on 2016/11/28.
 */
var db = require('../sqlserver');
const COUNTRY_TABLE = "CountryTable"
const SOLUTION_TABLE = 'WaterMeter';
const GROUP_TABLE = 'Group';
const LIGHT_TABLE = 'Light';
const USERSOLUTION_TABLE = 'UserSolution';


module.exports = {
    getAllCountries: function (fun) {
        console.log()
        return db.querySql('SELECT * FROM ' + COUNTRY_TABLE,'',function(err,result){
            return fun(err,result)
        })
    }

}