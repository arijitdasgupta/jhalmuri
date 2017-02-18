import * as express from 'express';
import { resolve } from 'universal-router';
import * as ReactDOMServer from 'react-dom/server';
import * as React from 'react';

import {PostsRepository} from '../repositories/PostsRepository';
import {SitesRepository} from '../repositories/SitesRepository';
import {IApplication} from '../interfaces/IApplication';
import {Page} from '../components/Page';
import {PageNotFound} from '../components/PageNotFound';
import {Routes} from '../routes/Routes';

export class RenderApplication implements IApplication {
    public app;

    constructor(private posts:PostsRepository,
                private site:SitesRepository) {

        this.app = express();

        this.app.get('*', (req: express.Request, res: express.Response, next) => {
            resolve(this.routes, req).then((actionFunk) => {
                actionFunk(req, res, next);
            });
        });
    }

    private renderFullHtml = (appState, renderedMarkup) => {
        return `<!doctype html>
        <html>
            <head>
                <title>Something</title>
            </head>
            <body>
                <div id="application">
                    ${renderedMarkup}
                </div>
            </body>
        </html>`;
    };

    private routes = [
        {
            path: Routes.HOME_PAGE,
            action: () => {
                return this.renderHomePage;
            },
        },
        {
            path: Routes.PAGE,
            action: (context) => {
                return this.renderPage;
            }
        },
        {
            path: Routes.SINGLE_POST,
            action: (context) => {
                return this.renderPost;
            }
        },
        {
            path: Routes.REST,
            action: () => {
                return this.renderNotFound;
            }
        }
    ];

    private renderHomePage = (req: express.Request, res: express.Response, next) => {
        this.posts.getPosts().then((posts) => {
            res.send(posts);
        });
    };

    private renderPage = (req: express.Request, res: express.Response, next) => {
        this.posts.getPosts(req.params.n).then((posts) => {
            res.send(posts);
        });
    };

    private renderPost = (req: express.Request, res: express.Response, next) => {
        this.posts.getPost(req.params.postName).then((post) => {
            if (post) {
                res.send(post);
            } else {
                this.renderNotFound(req, res, next);
            }
        });
    };

    private renderNotFound = (req: express.Request, res: express.Response, next) => {
        let renderedDom = ReactDOMServer.renderToStaticMarkup(<PageNotFound />);
        let renderedHtml = this.renderFullHtml({}, renderedDom);
        res.send(renderedHtml);
    };
}
