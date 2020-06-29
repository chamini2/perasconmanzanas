# Deployment

## Front-end

```shell
$ cd web
$ npm run build
$ npm run deploy-production
```

## Back-end

### Database

```shell
$ cap production deploy
$ ssh2backend
$ cd <project>/current/db
$ sqitch status
$ sqtich -f access.plan status
```

### PostgREST

```shell
$ cap production deploy
$ ssh2backend
$ cd <project>/current
$ # TODO
```

### API

```shell
$ cap production deploy
$ ssh2backend
$ cd <project>/current
$ # TODO
```
