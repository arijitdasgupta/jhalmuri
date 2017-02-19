import * as express from 'express';
import { resolve } from 'universal-router';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { connect, Provider } from 'react-redux';

import {PostsRepository} from '../repositories/PostsRepository';
import {SitesRepository} from '../repositories/SitesRepository';
import {IApplication} from '../interfaces/IApplication';
import {Page} from '../components/Page';
import {createRoutes} from '../routes/Routes';
import {StateModes} from '../enums/StateModes';
import * as _ from 'lodash';
import {Renderer} from '../renderer/Renderer';

// Native JS escape
declare let escape;

export class RenderApplication implements IApplication {
    public app;

    constructor(private posts:PostsRepository,
                private site:SitesRepository,
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
        this.posts.getPosts().then((posts) => {
            res.send(this.renderer.render({
                mode: StateModes.HOME_PAGE,
                pageData: posts
            }, Page));
        });
    };

    private handlePage = (req: express.Request, res: express.Response, next, context) => {
        let pageNumber = !(_.isNaN(parseInt(context.params.n)))?parseInt(context.params.n):0;
        this.posts.getPosts(pageNumber).then((posts) => {
            res.send(this.renderer.render({
                mode: StateModes.PAGE,
                pageData: posts
            }, Page));
        });
    };

    private handlePost = (req: express.Request, res: express.Response, next, context) => {
        this.posts.getPost(context.params.postName).then((post) => {
            if (post) {
                res.send(this.renderer.render({
                    mode: StateModes.SINGLE_POST,
                    pageData: post
                }, Page));
            } else {
                this.handleNotFound(req, res, next, context);
            }
        });
    };

    private handleNotFound = (req: express.Request, res: express.Response, next, context) => {
        // res.send(this.render({
        //     mode: StateModes.REST,
        //     pageData: {'not':'found'}
        // }, Page));
        next();
    };


}
