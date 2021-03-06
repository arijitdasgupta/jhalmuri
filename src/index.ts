import {MySqlPool} from './sql/MySqlPool';
import {MySqlQueries} from './sql/MySqlQueries';
import {PostsRepository} from './repositories/PostsRepository';
import {SitesRepository} from './repositories/SitesRepository';
import { isNaN } from 'lodash';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {ApiApplication} from './applications/ApiApplication';
import {RenderApplication} from './applications/RenderApplication';
import {StaticApplication} from './applications/StaticApplication';
import {IApplication} from './interfaces/IApplication';
import {Renderer} from './renderer/Renderer';
import {BlogService} from './services/BlogService';

// Configuration stuff
let BASEURL = process.env['BASE_URL'] || '/blog';
let PORT = isNaN(parseInt(process.env['SERVER_PORT'])) ? 7777 : parseInt(process.env['SERVER_PORT']);
let MYSQLHOST = process.env['MYSQL_HOST'] || 'localhost';
let MYSQLPORT = process.env['MYSQL_PORT'] || 3306;
let MYSQLUSER = process.env['MYSQL_USER'] || 'root';
let MYSQLPASSWORD = process.env['MYSQL_PASSWORD'] || 'password';
let WPDATABASE = process.env['MYSQL_DATABASE'] || 'wordpress';
let WPTABLEPREFIX = process.env['WP_TABLE_PREFIX'] || 'wp_';
let POSTS_PER_PAGE = isNaN(parseInt(process.env['POSTS_PER_PAGE'])) ? 10 : parseInt(process.env['POSTS_PER_PAGE']);

// Top level instances
console.log(`MySQL connection pooling to ${MYSQLHOST}:${MYSQLPORT} on DB ${WPDATABASE}`);
let mysqlConnectionPool = new MySqlPool({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: WPDATABASE,
    port: MYSQLPORT
});
let queries = new MySqlQueries(mysqlConnectionPool, WPTABLEPREFIX);
let posts = new PostsRepository(queries, POSTS_PER_PAGE);
let siteOptions = new SitesRepository(queries);
let blogService = new BlogService(posts, siteOptions);
let renderer = new Renderer(BASEURL);

// In an array so that sequential route resolve is maintained
let subApps:IApplication[] = [
    new ApiApplication(blogService),
    new StaticApplication(),
    new RenderApplication(blogService, renderer),
];

const application = express();

subApps.forEach((subApp:IApplication) => {
    application.use(BASEURL, subApp.app);
});

application.use(bodyParser.json());

console.log(`Starting server on ${PORT}`);
console.log(`Base URL is ${BASEURL}`);
application.listen(PORT);
