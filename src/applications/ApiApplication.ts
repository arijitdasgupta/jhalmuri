import {PostsRepository} from '../repositories/PostsRepository';
import {SitesRepository} from '../repositories/SitesRepository';
import * as express from 'express';
import {IApplication} from '../interfaces/IApplication';

export class ApiApplication implements IApplication {
    public app;

    constructor(private posts: PostsRepository,
                private siteOptions: SitesRepository) {

        this.app = express();
        
        this.app.get(`/api/post/:postName`, (req: express.Request, res: express.Response, next) => {
            posts.getPost(req.params.postName).then((results) => {
                res.send(results);
            });
        });

        this.app.get(`/api/posts`, (req: express.Request, res: express.Response, next) => {
            posts.getPosts().then((results) => {
                res.send(results);
            });
        });

        this.app.get(`/api/posts/page/:pageNum`, (req: express.Request, res: express.Response, next) => {
            posts.getPosts(req.params.pageNum).then((results) => {
                res.send(results);
            });
        });

        this.app.get(`/api/posts/count`, (req: express.Request, res: express.Response, next) => {
            posts.getPostCount().then((results) => {
                res.send(results);
            });
        });

        this.app.get(`/api/site`, (req: express.Request, res: express.Response, next) => {
            siteOptions.getSiteDetails().then((results) => {
                res.send(results);
            });
        });
    }
}