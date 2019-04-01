# ![Wurtzite](https://i.ibb.co/fdWN0jB/wurtzite.png)  Wurtzit e
Wurtzit is a simple, solid & opinionated foundation for teams desiring to work with Node.js and Typescript.

## Index

1. [Dependencies](#dependencies)
2. [Structure](#structure)
3. [Code Guidelines](#code-guidelines)
4. [Git Flow](#git-flow)
5. [Configuration](#configuration)
6. [Installation](#installation)
7. [Development](#development)
8. [Testing](#testing)
9. [Deploy](#deploy)

## Dependencies

- Node.JS 10.15.3
- Express.js -> Node HTTP Server
- Typescript -> JS Superset
- Nodemon -> Node runner
- TypeORM -> Database and migrations
- Docker -> Containers
- PostgreSQL -> BD
- Nconf -> Config provider

## Structure

```sh
| bin --- Server executables
    | www ---- Server init
    | Dockerfile ---- Dockerfile defines container foundations
    | app.ts ---- App initializer
| config --- config files
    | envs ---- Json (nconf compatible) files to run possible environments
    | ormconfig.ts ---- ORM config depends on envs
| dist ---- JS compiled files
| database
    | migrations ---- database migrations
    | seeds ---- prepopulate the database
| nginx ---- nginx configuration required by terraform
| src ----- source code
    | controllers ---- They have the main logic of the app (files here must be named controllerName.controller.ts)
    | entities ---- Repositories that map to the database. We use DataMapper with the help of TypeORM. Entities should be named entityName.entity.ts
    | middlewares ---- HTTP middlewares that simplify the logic in the controllers of the app.They should be named middlewareName.middleware.ts
    | providers ---- Service providers that help the system to interact with other infrastructure. Name them providerName.provider.ts
    | utils ---- Where can I put this file? utilName.util.ts
    | workers ---- Independent scripts that runs in a thread different to the express server but connects to different capabilities in the app.
| test ---- test the freaking code lazy man
```

## Code Guidelines

The project uses the TS Lint recommended settings, with 3 main overruled settings (take a look to tslint.json). It can be changed on tslint.json.
*Naming* should be addressed as mentioned in the [Structure section](#structure)

## Git Flow

We use git flow, take this into account:
- Create feature branches from master
- Use proper prefixes for your feature branches (hotfix, feature, chore, etc)
- Use the git message template included
- A codeowners file is included
- Use [semantic commit messages](https://seesparkbox.com/foundry/semantic_commit_messages)
- Before creating a final pull request rebase and squash your commits in the most efficient way. Is not neccesary to squash everything in one commit, and if makes sense (eg. separate some delicate changes to quickly identify them) you could have different squashed commits.
- Constantly rebase your feature branches with master.
- Create pull requests for every change you want to apply.
- Talk to your team

## Configuration

Configuration is enabled through nconf, and is available under the config folder in the project.

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd dillinger
$ npm install -d
$ node app
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

## Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma test
```
## Testing

For production release:
```sh
$ gulp build --prod
```
Generating pre-built zip archives for distribution:
```sh
$ gulp build dist --prod
```
## Deploy

Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
cd dillinger
docker build -t joemccann/dillinger:${package.json.version} .
```
This will create the dillinger image and pull in the necessary dependencies. Be sure to swap out `${package.json.version}` with the actual version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on your host. In this example, we simply map port 8000 of the host to port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart="always" <youruser>/dillinger:${package.json.version}
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:8000
```
