import * as express from 'express';
import {IApplication} from '../interfaces/IApplication';
import {BlogService} from '../services/BlogService';

export class ApiApplication implements IApplication {
    public app;

    constructor(private blogService: BlogService) {

        this.app = express();
        
        this.app.get(`/api/post/:postName`, (req: express.Request, res: express.Response, next) => {
            this.blogService.getSinglePost(req.params.postName).then((results) => {
                res.send(results);
            }).catch((err) => {
                res.send(err);
            });
        });

        this.app.get(`/api/posts`, (req: express.Request, res: express.Response, next) => {
            this.blogService.getPage(0).then((results) => {
                res.send(results);
            }).catch((err) => {
                res.send(err);
            });
        });

        this.app.get(`/api/posts/page/:pageNum`, (req: express.Request, res: express.Response, next) => {
            this.blogService.getPage(req.params.pageNum).then((results) => {
                res.send(results);
            }).catch((err) => {
                res.send(err);
            });
        });
    }
}