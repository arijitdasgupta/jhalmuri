import * as mysql from 'mysql';
import { IConnectionPool } from '../interfaces/IConnectionPool';

export interface IMySqlConnParams {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export class MySqlPool implements IConnectionPool {
  public connectionPool;

  constructor(configuration:IMySqlConnParams) {
    this.connectionPool = mysql.createPool(configuration);
  }
}
