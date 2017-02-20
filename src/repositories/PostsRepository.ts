import { MySqlQueries } from '../sql/MySqlQueries';
import {IPostSqlData, IPostSqlCount} from '../interfaces/IPost';

export class PostsRepository {
  constructor(
    private queries:MySqlQueries,
    private nPostsPerPage:number
  ) {}

  public getPosts(pageNumber:number = 0):Promise<IPostSqlData[]> {
    const offset = this.nPostsPerPage * pageNumber;
    const limit = this.nPostsPerPage;
    return this.queries.getPostsTable(offset, limit);
  }

  public getPost(postName:string):Promise<IPostSqlData> {
    return this.queries.getPostRowByName(postName);
  }

  public getPostCount():Promise<number> {
    return this.queries.getPostsCount().then(function(countObject:IPostSqlCount) {
      return countObject.count;
    });
  }

  public getNPostsPerPage():number {
      return this.nPostsPerPage;
  }
}
