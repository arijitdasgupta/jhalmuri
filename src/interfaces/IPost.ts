import {IAuthorData} from './IAuthorData';

export interface IPostSqlData {
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
