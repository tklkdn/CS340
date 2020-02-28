var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_kodanit',
  password        : '2646',
  database        : 'cs340_kodanit'
});

module.exports.pool = pool;