'use strict';
var Promise = require('bluebird');
var using = Promise.using;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
var options = require('./config').db2;
var db = {};
var mysql = require('mssql');
//var pool = mysql.createPool(options);

db.query = function (sql, values) {
    mysql.close()
    return using(
        mysql.connect(options).then(function () {
            new mysql.Request().query(sql).then(function (result) {
                console.dir(result)
                return result;
            });
        }).catch(function (err) {
            throw new Error(err);
        })
    )


    //return using(pool.getConnectionAsync().disposer(function (connection) {
    //    return connection.destroy();
    //}), function (connection) {
    //    return connection.queryAsync(sql, values).then(function (result) {
    //        return result[0];
    //    }).catch(function (err) {
    //        throw new Error(err);
    //    });
    //});
};
db.queryWithCount = function (sql, values) {
    var data = {};
    return using(pool.getConnectionAsync().disposer(function (connection) {
        return connection.destroy();
    }), function (connection) {
        return connection.queryAsync(sql, values).then(function (result) {
            data.rows = result[0];
            return connection.queryAsync("SELECT FOUND_ROWS() as count");
        }).then(function (result) {
            data.count = result[0][0].count;
            return data;
        }).catch(function (err) {
            throw new Error(err);
        });
    });
};

module.exports = db;