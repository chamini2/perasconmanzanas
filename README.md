# perasconmanzanas.com

Inventory management system. System to manage inventory of small businesses.

## Development

**TODO:** Explain how to get the necessary parts up and running for develpoment

## Deployment

### Front-end

```shell
$ cd web
$ npm run build
$ npm run deploy-production
```

### Back-end

#### Database

```shell
$ cap production deploy
$ ssh2backend
$ cd <project>/current/db
$ sqitch status
$ sqtich -f access.plan status
```

#### PostgREST

```shell
$ cap production deploy
$ ssh2backend
$ cd <project>/current
$ # TODO
```

#### API

```shell
$ cap production deploy
$ ssh2backend
$ cd <project>/current
$ # TODO
```
