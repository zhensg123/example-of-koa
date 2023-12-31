const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')  // 返回给前端的json对象
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const employee = require('./routes/employee')
const users = require('./routes/users')

const jwtAuth = require('./routes/jwt')
const swagger = require('./routes/swagger')

const cors = require('@koa/cors')
// error handler
// 对错误进行统一处理  可以自定义对app进行统一处理
onerror(app, {
  json: function (err, ctx) {
    if (err.name === 'UnauthorizedError') {
      ctx.status = 200;

      ctx.body = {
        code: -2,
        msg: 'token失效',
        error: err.status,
        errorMsg: err.name
      }
      return
    }
      ctx.status = 500;
      ctx.body = { message: err.message };
  },
  html: function (err, ctx) {
      ctx.status = 500;
      ctx.body = '<p>Something wrong, please contact administrator.</p>';
  }
})

// middlewares  处理post json 数据
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
const { koaSwagger } = require('koa2-swagger-ui');
app.use(
  koaSwagger({
    routePrefix: '/swagger/index.html', // 这里配置swagger的访问路径
    swaggerOptions: {
      url: '/swagger/swagger.json', // 这里配置swagger的文档配置URL，也就是说，我们展示的API都是通过这个接口生成的。
    },
  }),
);

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(cors())

app.use(jwtAuth)
// routes
app.use(swagger.routes(), swagger.allowedMethods())

app.use(index.routes(), index.allowedMethods())
app.use(employee.routes(), employee.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling 暂时还不知道怎么用
app.on('error', async (err, ctx) => {
 
});

// 看进程错误处理
process.on('uncaughtException', function(err) {
  console.log('uncaughtException', err)
})

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
})
module.exports = app
