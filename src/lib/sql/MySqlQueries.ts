import { IConnectionPool } from '../../interfaces/IConnectionPool';
import { IPostSqlData, IPostSqlCount } from '../../interfaces/IPost';
import { ISiteSqldata } from '../../interfaces/ISiteData';

export class MySqlQueries {
  constructor(private pool:IConnectionPool) {}

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

  public getPostsTable = (offset:number, limit:number):Promise<IPostSqlData[]> => {
    return this.doQuery<IPostSqlData[]>(`select * from wp_posts
      where post_status='publish'
      order by post_date_gmt desc
      limit ${limit}
      offset ${offset}`);
  }

  public getPostRowByName = (postName:string):Promise<IPostSqlData> => {
    return this.doQuery<IPostSqlData>(`select * from wp_posts
      where post_status='publish'
      and
      post_name='${postName}'`).then((result) => {
        return result[0];
      });
  }

  public getPostsCount = ():Promise<IPostSqlCount> => {
    return this.doQuery<IPostSqlCount>(`select count(*) from wp_posts
      where post_status='publish'`).then((count) => {
        return {count: count[0]['count(*)']}
      });
  }

  public getOptionsTable = ():Promise<ISiteSqldata> => {
    return this.doQuery<ISiteSqldata>(`select * from wp_options`);
  }
}
