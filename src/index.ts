import {MySqlPool} from './lib/sql/MySqlPool';
import {MySqlQueries} from './lib/sql/MySqlQueries';
import {PostsRepository} from './lib/repositories/PostsRepository';
import {SitesRepository} from './lib/repositories/SitesRepository';
import { isNaN } from 'lodash';
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Configuration stuff
let BASEURL = process.env['BASE_URL'] || '/blog';
let PORT = isNaN(parseInt(process.env['SERVER_PORT'])) ? 7777 : parseInt(process.env['SERVER_PORT']);
let MYSQLHOST = process.env['MYSQL_HOST'] || 'localhost';
let MYSQLPORT = process.env['MYSQL_PORT'] || 3306;
let MYSQLUSER = process.env['MYSQL_USER'] || 'root';
let MYSQLPASSWORD = process.env['MYSQL_PASSWORD'] || 'password';
let WPDATABASE = process.env['MYSQL_DATABASE'] || 'wordpress';
let WPTABLEPREFIX = process.env['WP_TABLE_PREFIX'] || 'wp_';

// Top level instances
let mysqlConnectionPool = new MySqlPool({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: WPDATABASE,
    port: MYSQLPORT
});
console.log(`MySQL collection pooling to ${MYSQLHOST}:${MYSQLPORT} on DB ${WPDATABASE}`);

let queries = new MySqlQueries(mysqlConnectionPool, WPTABLEPREFIX);
let posts = new PostsRepository(queries, 10);
let siteOptions = new SitesRepository(queries);

const application = express();

// App config
application.get(`${BASEURL}/api/posts`, (req: express.Request, res: express.Response, next) => {
    posts.getPosts().then((results) => {
       res.send(results);
    });
});

// App config
application.get(`${BASEURL}/api/site`, (req: express.Request, res: express.Response, next) => {
    siteOptions.getSiteDetails().then((results) => {
        res.send(results);
    });
});

console.log(`Starting server on ${PORT}`);
console.log(`Base URL is ${BASEURL}`);
application.use(bodyParser.json());
application.listen(PORT);