/**
 * Created by Duke on 2016/11/28.
 */
var db = require('../mysql');
const GATEWAY_TABLE = 'Gateway';
const SOLUTION_TABLE = 'WaterMeter';
const GROUP_TABLE = 'Group';
const LIGHT_TABLE = 'Light';
const USERSOLUTION_TABLE = 'UserSolution';


module.exports = {
    searchLight: function () {
        return db.query('SELECT * FROM ' + SOLUTION_TABLE)
    }
}