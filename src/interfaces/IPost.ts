import {IAuthorData, IAuthorSqlData} from './IAuthorData';

// Thanks to INNER JOIN
export interface IPostSqlData extends IAuthorSqlData {
  post_title: string;
  post_content: string;
  post_type: string;
  post_name: string;
  post_mime_type: string;
  post_author: number;
  post_date: Date;
  post_date_gmt: Date;
}

export interface IPost {
  postTitle: string;
  postContent: string;
  postType: string;
  postName: string;
  postAuthor: IAuthorData;
  postMime: string;
  postDate: Date;
  postDateGmt: Date;
}

export interface IPostSqlCount {
  count: number;
}
