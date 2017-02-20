import {SitesRepository} from '../repositories/SitesRepository';
import {PostsRepository} from '../repositories/PostsRepository';
import {StateModes} from '../enums/StateModes';
import {IRenderData} from '../interfaces/IRenderData';
import {ISiteOptions, ISqlSiteOptions} from '../interfaces/ISiteData';
import {IAuthorSqlData, IAuthorData} from '../interfaces/IAuthorData';
import {IPostSqlData, IPost} from '../interfaces/IPost';

export class BlogService {
    constructor(private posts:PostsRepository,
                private siteDetails:SitesRepository){}

    private convertSiteDetailsToObject = (siteOptions: ISqlSiteOptions, postCount: number):ISiteOptions => {
        return {
            siteUrl: siteOptions.site_url,
            homeUrl: siteOptions.home,
            blogName: siteOptions.blogname,
            adminEmail: siteOptions.admin_email,
            totalPostCount: postCount
        };
    };

    private convertAuthorDetailToObject = (authorSqlData: IAuthorSqlData):IAuthorData => {
        return {
            userLogin: authorSqlData.user_login,
            userEmail: authorSqlData.user_email,
            userNickname: authorSqlData.user_nicename,
            displayName: authorSqlData.display_name
        };
    };

    private convertPostDataToObject = (postData: IPostSqlData, authorData: IAuthorData):IPost => {
        return {
            postTitle: postData.post_title,
            postContent: postData.post_content,
            postType: postData.post_mime_type,
            postName: postData.post_name,
            postAuthor: {
                userLogin: authorData.userLogin,
                userEmail: authorData.userEmail,
                userNickname: authorData.userNickname,
                displayName: authorData.displayName
            },
            postMime: postData.post_mime_type,
            postDate: postData.post_date,
            postDateGmt: postData.post_date_gmt
        };
    }

    public getPage = (pageNo:number = 0):Promise<IRenderData> => {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.posts.getPosts(pageNo),
                this.siteDetails.getSiteDetails(),
                this.posts.getPostCount()
            ]).then(([posts, siteOptions, postCount]) => {
                const siteDetails = this.convertSiteDetailsToObject(siteOptions, postCount);
                resolve({
                    mode: StateModes.PAGE,
                    pageData: {
                        siteDetails: siteDetails,
                        content: posts
                    }
                });
            }).catch((err) => {
                reject(err);
            });
        });
    };

    public getSinglePost = (postName:string):Promise<IRenderData> => {
      return new Promise((resolve, reject) => {
          Promise.all([
              this.posts.getPost(postName),
              this.siteDetails.getSiteDetails(),
              this.posts.getPostCount()
          ]).then(([post, siteOptions, postCount]) => {
              if (post) {
                  const siteDetails = this.convertSiteDetailsToObject(siteOptions, postCount);
                  resolve({
                      mode: StateModes.SINGLE_POST,
                      pageData: {
                          content: post,
                          siteDetails: siteDetails
                      }
                  });
              } else {
                  reject(true)
              }
          }).catch((err) => {
              reject(err);
          });
      });
    };
}
