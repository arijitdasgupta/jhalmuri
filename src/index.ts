import * as mysql from 'mysql';

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wordpress',
  port: 3306
});

connection.connect(function(err) {
  console.log(err);

  connection.query(`Select * from wp_posts where post_status='publish'`, function(err, results) {
    console.log(results);
    connection.release();
  });
});

console.log(mysql);
console.log('hello');
