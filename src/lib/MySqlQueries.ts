import { MySqlPool } from './MySqlPool';
import { IPostSqlData } from '../interfaces/IPost';
import { ISiteSqldata } from '../interfaces/ISiteData';

export class MySqlQueries {
  constructor(private pool:MySqlPool) {}

  private doQuery = <T>(queryString:string):Promise<T> => {
    return this.pool.getConnection().then((connection) => {
      return new Promise((resolve, reject) => {
        connection.query(queryString, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results as T);
          }
          connection.release();
        });
      });
    });
  }

  public getPostsTable = ():Promise<IPostSqlData[]> => {
    return this.doQuery<IPostSqlData[]>(`select * from wp_posts where post_status='publish'`);
  }

  public getOptionsTable = ():Promise<ISiteSqldata> => {
    return this.doQuery<ISiteSqldata>(`select * from wp_options`);
  }
}
