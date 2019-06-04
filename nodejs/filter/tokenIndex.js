/**
 * Created by Duke on 2016/12/6.
 */

var tokens = [];
var uuid = require('node-uuid');

module.exports = {
    findUserId: function (token) {
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].token == token) {
                return tokens[i].id;
            }
        }
        return null;
    },
    findUserAccount: function (token) {
        for (var i = 0; i < token.length; i++) {
            if (tokens[i].token == token) {
                return tokens[i].account;
            }
        }
        return null;
    },
    loginUser: function (account, uid) {
        var count = 0;
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].account == account) {
                var tokenhas = uuid.v4();
                tokens[i] = {
                    account: account,
                    token: tokenhas,
                    id: uid
                }
                count++
                return tokenhas;
            }
        }
        if (count == 0) {
            var tokennothing = uuid.v4();
            tokens.push({
                account: account,
                token: tokennothing,
                id: uid
            })
            return tokennothing;
        }

    }
}