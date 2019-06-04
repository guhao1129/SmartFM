/**
 * Created by Duke on 16/8/30.
 */
var http = require('http'),
    assert = require('assert')

var opts = {
    host: 'localhost',
    port: 8000,
    path: '/send',
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'}
}

var req = http.request(opts, function (res) {
    res.setEncoding('utf8')
    var data = ""
    res.on('data', function (d) {
        data += d
    })

    res.on('end', function () {
        console.log(data)
        assert.strictEqual(data, '{"status":"ok","message":"Tweet received"}')
    })
})

req.write('tweet=test')
req.end()