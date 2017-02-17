import { MySqlPool } from './lib/MySqlPool';
import { MySqlQueries } from './lib/MySqlQueries';
import { IPost } from './interfaces/IPost';

let mysqlConnectionPool = new MySqlPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wordpress',
  port: 3306
});

let queries = new MySqlQueries(mysqlConnectionPool);
// One query to get them all...
queries.getAllPosts().then((results) => {
  console.log(results.map((item) => {
    return item.post_title;
  }));
  mysqlConnectionPool.end();
});
