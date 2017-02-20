import * as express from 'express';
import { resolve } from 'universal-router';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { connect, Provider } from 'react-redux';

import {IApplication} from '../interfaces/IApplication';
import {createRoutes} from '../routes/Routes';
import * as _ from 'lodash';
import {Renderer} from '../renderer/Renderer';
import {BlogService} from '../services/BlogService';
import {Page} from '../components/Page';

export class RenderApplication implements IApplication {
    public app;

    constructor(private blogService: BlogService,
                private renderer: Renderer) {

        this.app = express();

        this.app.get('*', (req: express.Request, res: express.Response, next) => {
            let routes = createRoutes({
                HOME_PAGE: this.handleHomePage,
                PAGE: this.handlePage,
                SINGLE_POST: this.handlePost,
                REST: this.handleNotFound
            });

            resolve(routes, req).then((actionFunk) => {
                actionFunk(req, res, next);
            });
        });
    }

    private handleHomePage = (req: express.Request, res: express.Response, next, context) => {
        this.blogService.getPage(0).then((data) => {
            res.send(this.renderer.render(data, Page));
        }).catch((err) => {
            console.log(err);
            this.handleNotFound(req, res, next, context);
        });
    };

    private handlePage = (req: express.Request, res: express.Response, next, context) => {
        let pageNumber = !(_.isNaN(parseInt(context.params.n)))?(parseInt(context.params.n) - 1):0;
        this.blogService.getPage(pageNumber).then((data) => {
           res.send(this.renderer.render(data, Page));
        }).catch((err) => {
            console.log(err);
            this.handleNotFound(req, res, next, context);
        });
    };

    private handlePost = (req: express.Request, res: express.Response, next, context) => {
        this.blogService.getSinglePost(context.params.postName).then((data) => {
            res.send(this.renderer.render(data, Page));
        }).catch((err) => {
            console.log(err);
            this.handleNotFound(req, res, next, context);
        })
    };

    private handleNotFound = (req: express.Request, res: express.Response, next, context) => {
        next();
    };


}
