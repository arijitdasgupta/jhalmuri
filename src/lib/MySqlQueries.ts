import { MySqlPool } from './MySqlPool';

export class MySqlQueries {
  constructor(private pool:MySqlPool) {}

  getAllPosts = () => {
    return new Promise((resolve, reject) => {
      this.pool.connectionPool.getConnection(function (err, connection) {
          if (!err) {
              connection.query(`select * from wp_posts where post_status='publish'`, function (err, results) {
                  connection.release();
                  resolve(results);
              });
          } else {
            reject(err);
          }
      });
    });
  }
}
