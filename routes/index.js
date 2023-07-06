const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  // 不同于express的地方
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})




// module.exports = router



// const {
//   CODE_ERROR,
//   CODE_TOKEN_EXPIRED
// } = require('../utils/constant')
// const boom = require('boom')
// const userRouter = require('./users')
// const employeeRouter = require('./employee')
// const jwtAuth = require('./jwt')
// // 注册路由
// const router = require('koa-router')()


// 解析token获取用户信息
// router.use(function (req, res, next) {
//   // authorization 必须为这个  和前端保持一致
//     var token = req.headers['authorization'];
  
//     if (token == undefined) {
//       return next();
//     } else {
//       vertoken.verToken(token).then((data) => {
//         req.data = data;
//         return next();
//       }).catch((error) => {
//         return next();
//       })
//     }
//   });

// 对后续请求进行身份验证
// router.use(jwtAuth)

// router.get('/', function(req, res) {
//   // 默认会带上layout文件 可以通过layout:null 去掉
//   // 注意layout内需要注入{{{body}}}才会起作用
//   res.render('index');
// })

// router.use('/user', userRouter)
// router.use('/employee', employeeRouter)
/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
// router.use((req, res, next) => {
//   next(boom.notFound('接口不存在'))
// })

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
// router.use((err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
//     console.log(err)
//     res.json({
//       code: CODE_TOKEN_EXPIRED,
//       msg: 'token失效',
//       error: err.status,
//       errorMsg: err.name
//     })
//   } else {
//     const msg = (err && err.message) || '系统错误'
//     const statusCode = (err.output && err.output.statusCode) || 500;
//     const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
//     res.status(statusCode).json({
//       code: CODE_ERROR,
//       msg,
//       error: statusCode,
//       errorMsg
//     })
//   }
// })

module.exports = router

