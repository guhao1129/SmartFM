/**
 * Created by Duke on 2016/12/2.
 */
var db = require('../mysql');
const USER_TABLE = 'User';

module.exports = {
    loginUsers: function (account) {
        return db.query('select * from ' + USER_TABLE + ' where Account = ?;', [account]);
    }
}
