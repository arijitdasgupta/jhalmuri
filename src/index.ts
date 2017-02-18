import { MySqlPool } from './lib/MySqlPool';
import { MySqlQueries } from './lib/MySqlQueries';

let mysqlConnectionPool = new MySqlPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'wordpress',
  port: 3306
});

let queries = new MySqlQueries(mysqlConnectionPool);
// One query to get them all...
queries.getPostsTable().then((results) => {
  console.log(results.map((item) => {
    return item.post_title;
  }));

  queries.getOptionsTable().then((result) => {
    console.log(result);

    mysqlConnectionPool.end();
  });
});
