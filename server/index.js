const koa = require('koa');
const koaStatic = require('koa-static');
const koaProxy = require('koa-proxy');

const app = new koa();

app.use(koaStatic(require('path').resolve(__dirname, './public')))
  .use(koaProxy({ host: 'http://211.68.191.30:8090/' }))
  .listen(80)