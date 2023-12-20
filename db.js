const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'b6ky0e9rv7ncnqhi78ss-mysql.services.clever-cloud.com',
    user: 'uapmxwq1li2hyehm',
    password: 'GzbFqZpup9gmGE6IZ5Yv',
    database: 'b6ky0e9rv7ncnqhi78ss',
});

module.exports = pool;