# NC News API

Hosted link : https://nc-news-server-duxo.onrender.com/

## About

This api provides database access for my full-stack nc-news application built at northcoders. This api has multiple endpoints for accessing, managing, querying data. The server is built with express, interacting with a postgreSQL database with the node-pg library, and follows the MVC design pattern. Here is a list of some of the libraries used to build this back-end application.

- node.js
- express
- node-pg
- pg-format
- dotenv
- husky
- jest

Building this app I applied real-world development practices as best as I could. I tried to make small incremental changes akin to what a team would achieve following the AGILE methodology, making use of multiple git branches to organise new features. The code also aligns with the MVC design pattern, and utilised jest to apply TDD.

## Instructions

In order to set-up this project for test and development, first clone the repo in your terminal.

```
git clone https://github.com/Harrywg/nc-news.git
```

Ensure that you install the required dependencies.

```
npm i
```

Setup and seed the local database if you want to send local requests.

```
npm run
```

.env.test

```sql
PGDATABASE=nc_news_test
```

.env.development

```sql
PGDATABASE=nc_news
```
