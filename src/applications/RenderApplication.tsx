import * as express from 'express';
import { resolve } from 'universal-router';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { connect, Provider } from 'react-redux';

import {IApplication} from '../interfaces/IApplication';
import {createRoutes, IActionSpec} from '../routes/Routes';
import * as _ from 'lodash';
import {Renderer} from '../renderer/Renderer';
import {BlogService} from '../services/BlogService';
import {Page} from '../components/Page';
import {PostLink} from '../components/PostLink';
import {Paragraph} from '../components/Paragraph';

export class RenderApplication implements IApplication {
    public app;

    constructor(private blogService: BlogService,
                private renderer: Renderer) {

        this.app = express();

        this.app.get('*', (req: express.Request, res: express.Response, next) => {
            let routeSpecification = {
                HOME_PAGE: this.handleHomePage,
                BARE_LINKS_HOME_PAGE: this.handleBareLinksHomePage,
                PAGE: this.handlePage,
                SINGLE_POST: this.handlePost,
                REST: this.handleNotFound
            };

            let routes = createRoutes(this.wrapSpecialHandler(routeSpecification));

            resolve(routes, req).then((actionFunk) => {
                actionFunk(req, res, next);
            });
        });
    }

    private wrapSpecialHandler = (routeSpecs):IActionSpec => {
        let newRouteSpecs = ({} as IActionSpec);
        _.forEach(routeSpecs, (routeHandler, routeName) => {
            newRouteSpecs[routeName] = (req: express.Request, res: express.Response, next, context) => {
                if (req.query.raw && req.query.raw === 'true') {
                    routeHandler(req, res, next, context); // TODO: Make the raw handler work
                } else if (req.query.bare && req.query.bare === 'true') {
                    routeHandler(req, res, next, context); // TODO: Make the bare handler work
                } else {
                    routeHandler(req, res, next, context);
                }
            }
        });
        return newRouteSpecs;
    }

    private handleHomePage = (req: express.Request, res: express.Response, next, context) => {
        this.blogService.getPage(0).then((data) => {
            res.send(this.renderer.render(data, Page));
        }).catch((err) => {
            console.log(err);
            this.handleNotFound(req, res, next, context);
        });
    };

    // TODO: Refactor later...
    private handleBareLinksHomePage = (req: express.Request, res: express.Response, next, context) => {
        this.blogService.getPage(0).then((data) => {
            let posts = _.map(data.pageData.content, (item) => {return {post: item};});
            let Component = (props) => {
                return (<Paragraph>{PostLink(props)}</Paragraph>);
            };
            res.send(this.renderer.renderRepeater(posts, Component));
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
