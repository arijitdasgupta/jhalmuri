jhalmuri
========

A Wordpress blog rendering engine running on nodeJS
----------------------------------------------------

### Especially useful for embedding blogs in other pages
This docker enabled application provides a few API endpoints and a few rendered HTML outputs for simple blog timeline rendering from a Wordpress blog.

#### HTTP API
 - `/api/posts` returns first page posts in JSON
 - `/api/post/<postName>` returns a single post object in JSON
 - `/api/posts/page/<pageNumber>` returns posts from a specific page as mentioned in the path in JSON

#### Page rendering
 - `/` renders the first page of the blog in complete HTML
 - `/<postName>` renders the specific blog post in complete HTML
 - `/page/<pageNumber>` renders the specific page mentioned in the path in complete HTML
 - `/bare` renders post titles as links ONLY. Not a complete HTML.

To run in production mode,
`yarn run build`
`yarn run start`

To run in development mode,
`yarn run watch`

#### Environment variables
Should be self explanatory,

 - `BASE_URL` default `/blog`
 - `SERVER_PORT` default `7777`
 - `MYSQL_HOST` default `localhost`
 - `MYSQL_PORT` default `3306`
 - `MYSQL_USER` default `root`
 - `MYSQL_PASSWORD` default `password`
 - `MYSQL_DATABASE` default `wordpress`
 - `WP_TABLE_PREFIX` default `wp_`
 - `POSTS_PER_PAGE` default `10`

#### Notes:
 - No swagger yet
 - Refactor repeater template logic
 - No single page application
 - No styling
 - No unit tests :-P

#### Known bugs
 - Page links don't works
