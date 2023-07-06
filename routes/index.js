const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  // 不同于express 
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  // 返回值也不同于express
  ctx.body = {
    title: 'koa2 json'
  }
})


module.exports = router

