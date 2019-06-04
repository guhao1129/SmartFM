/**
 * Created by Duke on 2016/11/29.
 */
module.exports = {
    db: {
        user: 'root',
        password: '1@34qwer',
        database: 'waliData'
    },
    db2: {
        user: 'smartFM',
        password: 'FM#201903Fonder',
        server: '47.101.133.246',
        database: 'smartFM',
        options: {
            encrypt: true
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    },
    db3: {
        user: 'gj',
        password: 'gj',
        server: '47.101.133.246',
        database: 'smartFMTest',
        options: {
            encrypt: true
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    }
    ,
    app: {
        locale: 'en'
    }
}