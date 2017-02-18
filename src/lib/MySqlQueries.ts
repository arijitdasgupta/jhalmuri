import { MySqlPool } from './MySqlPool';
import { IPost } from '../interfaces/IPost';

export class MySqlQueries {
  constructor(private pool:MySqlPool) {}

  private getConnection = () => {
    return new Promise((resolve, reject) => {
        this.pool.connectionPool.getConnection(function (err, connection) {
          if (!err) {
            resolve(connection);
          } else {
            reject(err);
          }
        });
    });
  }

  // Make this RxJS compatible
  getAllPosts = () => {
    return new Promise<IPost[]>((resolve, reject) => {
      this.getConnection.then((connection) => {
        connection.query(`select * from wp_posts where post_status='publish'`, function (err, results) {
            connection.release();
            resolve(results as IPost[]);
        });
      });
    });
  }

  getSiteData = () => {
    return new Promise((resolve, reject) => {
      this.pool.connectionPool.getConnection(function (err, connection) {

      });
    });
  }
}
