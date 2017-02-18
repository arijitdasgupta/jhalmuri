import * as express from 'express';
import { resolve } from 'universal-router';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import {PostsRepository} from '../repositories/PostsRepository';
import {SitesRepository} from '../repositories/SitesRepository';
import {IApplication} from '../interfaces/IApplication';
import {Page} from '../components/Page';
import {createRoutes} from '../routes/Routes';
import {mainReducer} from '../reducers/mainReducer';
import {StateModes} from '../enums/StateModes';
import * as _ from 'lodash';

// Native JS escape
declare var escape;

export class RenderApplication implements IApplication {
    public app;

    constructor(private posts:PostsRepository,
                private site:SitesRepository) {

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
            res.send(this.render({
                mode: StateModes.HOME_PAGE,
                pageData: posts
            }, Page));
        });
    };

    private handlePage = (req: express.Request, res: express.Response, next, context) => {
        let pageNumber = !(_.isNaN(parseInt(context.params.n)))?parseInt(context.params.n):0;
        this.posts.getPosts(pageNumber).then((posts) => {
            res.send(this.render({
                mode: StateModes.PAGE,
                pageData: posts
            }, Page));
        });
    };

    private handlePost = (req: express.Request, res: express.Response, next, context) => {
        this.posts.getPost(context.params.postName).then((post) => {
            if (post) {
                res.send(this.render({
                    mode: StateModes.SINGLE_POST,
                    pageData: post
                }, Page));
            } else {
                this.handleNotFound(req, res, next, context);
            }
        });
    };

    private handleNotFound = (req: express.Request, res: express.Response, next, context) => {
        // let renderedDom = ReactDOMServer.renderToStaticMarkup(<PageNotFound />);
        // let renderedHtml = this.renderFullHtml({}, renderedDom);
        // res.send(renderedHtml);
        res.send(this.render({
            mode: StateModes.REST,
            pageData: {'not':'found'}
        }, Page));
    };

    private render = (state, component) => {
        let store = createStore(mainReducer, state);
        let App = connect((state) => {
            return {
                mode: state.mode,
                pageData: state.pageData
            };
        }, () => { // No actions on the server
            return {};
        })(component);
        let renderedDom = renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        );
        let renderedHtml = this.renderFullHtml(state, renderedDom);
        return renderedHtml;
    };

    private renderFullHtml = (appState, renderedMarkup) => {
        const appStateString = escape(JSON.stringify(appState));

        return `<!doctype html>
        <html>
            <head>
                <title>Something</title>
                <script>
                    window.__APP__STATE__STRING__ = '${appStateString}';
                </script>
            </head>
            <body>
                <div id="application">
                    ${renderedMarkup}
                </div>
            </body>
        </html>`;
    };
}
