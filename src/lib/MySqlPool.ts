import * as mysql from 'mysql';

export interface IMySQLConnParams {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export class MySqlPool {
  public connectionPool;

  constructor(configuration:IMySQLConnParams) {
    this.connectionPool = mysql.createPool(configuration);
  }

  public end = () => {
    return new Promise((resolve, reject) => {
      this.connectionPool.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}
