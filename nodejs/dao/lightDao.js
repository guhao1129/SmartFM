/**
 * Created by Duke on 2016/11/28.
 */
var db = require('../mysql');
const GATEWAY_TABLE = 'Gateway';
const SOLUTION_TABLE = 'Solution';
const GROUP_TABLE = 'Group';
const LIGHT_TABLE = 'Light';
const USERSOLUTION_TABLE = 'UserSolution';


module.exports = {
    searchLight: function (userId) {
        return db.query('SELECT * FROM ' + SOLUTION_TABLE + ' where `Timestamp` in(select max(`Timestamp`) from ' + SOLUTION_TABLE + ' group by SolutionName) and id in (SELECT sid FROM ' + USERSOLUTION_TABLE + ' WHERE uid = ? );', userId);
    },
    searchGateway: function (solutionId) {
        return db.query('SELECT * FROM ' + GATEWAY_TABLE + ' where SolutionID = ?', solutionId);
    },
    searchGroup: function (solutionId, gatewayId) {
        return db.query('SELECT * FROM `' + GROUP_TABLE + '` where SolutionID = ? and GatewayID = ?', [solutionId, gatewayId]);
    },
    searchLights: function (solutionId, gatewayId, groupId) {
        console.log('SELECT l.* FROM ' + LIGHT_TABLE + ' AS l left join `' + GROUP_TABLE + '` g ON l.GroupId = g.id WHERE g.GatewayId = ?' +
            ' AND l.SolutionID =  ? AND l.GroupId=? ORDER BY l.id', [gatewayId, solutionId, groupId])
        return db.query('SELECT l.* FROM ' + LIGHT_TABLE + ' AS l left join `' + GROUP_TABLE + '` g ON l.GroupId = g.id WHERE g.GatewayId = ?' +
            ' AND l.SolutionID =  ? AND l.GroupId=? ORDER BY l.id desc', [gatewayId, solutionId, groupId]);
    },
    searchGroupLights: function (solutionId, gatewayId) {
        console.log(" SELECT * FROM " + LIGHT_TABLE + " where GroupID in (SELECT id from `Group` WHERE SolutionID=" + solutionId + " and GatewayID = " + gatewayId + " );")
        return db.query('SELECT * FROM ' + LIGHT_TABLE + ' where GroupID in (SELECT id from `Group` WHERE SolutionID=? and GatewayID = ? ) ORDER BY id desc;', [solutionId, gatewayId]);
    }

}