import { IConnectionPool } from '../interfaces/IConnectionPool';
import { IPostSqlData, IPostSqlCount } from '../interfaces/IPost';
import { ISiteOptionsTableItem } from '../interfaces/ISiteData';

export class MySqlQueries {
  private postsTableName:string;
  private optionsTableName:string;

  constructor(private pool:IConnectionPool, private wpTablePrefix:string) {
    this.postsTableName = `${wpTablePrefix}posts`;
    this.optionsTableName = `${wpTablePrefix}options`;
  }

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
  };

  public getPostsTable = (offset:number, limit:number):Promise<IPostSqlData[]> => {
    return this.doQuery<IPostSqlData[]>(`select * from ${this.postsTableName}
      where post_status='publish'
      order by post_date_gmt desc
      limit ${limit}
      offset ${offset}`);
  }

  public getPostRowByName = (postName:string):Promise<IPostSqlData> => {
    return this.doQuery<IPostSqlData>(`select * from ${this.postsTableName}
      where post_status='publish'
      and
      post_name='${postName}'`).then((result) => {
        return result[0];
      });
  }

  public getPostsCount = ():Promise<IPostSqlCount> => {
    return this.doQuery<IPostSqlCount>(`select count(*) from ${this.postsTableName}
      where post_status='publish'`).then((count) => {
        return {count: count[0]['count(*)']}
      });
  }

  public getOptionsTable = ():Promise<ISiteOptionsTableItem[]> => {
    return this.doQuery<ISiteOptionsTableItem[]>(`select * from ${this.optionsTableName}`);
  }
}
