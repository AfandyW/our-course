# Our Course

project dibuat menggunakan nodeJS, serverless framework. Untuk kebutuhan manage users and course.

## Technologies

-   Nodejs v19.6.1
-   Serverless-framework
-   PostresSQL Database

## Libraries

-   Sequelize ORM
-   serverless-offline
-   serverless-bundle

## Running Local

-   install library

```bash
serverless plugin install -n serverless-bundle

serverless plugin install -n serverless-offline

npm i
```

-   Change config file `secrets.json` to according to the local database

-   Start Project

```
sls offline start
```

# API Contract

on project root, download `Our-Course.postman_collection.json`, and import to your postman.
