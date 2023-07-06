const koaJwt = require('koa-jwt');

const { PRIVATE_KEY } = require('../utils/code-status');

const jwtAuth = koaJwt({
     secret: PRIVATE_KEY,
    //  credentialsRequired: false // 设置为false就不进行校验了，游客也可以访问
}).unless({
    path: [
        '/',
        '/user/login',
        // '/user/register',
        // /^\/userTemplateInst\/shareinfo\/.*/,
        //'/upload/access',
        '/api-docs',
        "/string",
        "/json",
        "/swagger/index.html",
        '/swagger/swagger.json',
        '/favicon.png'
        // '/user/all',
        // /^\/user\/delete\/.*/,
        // /^\/user\/update\/.*/,
        // /^\/user\/add\/.*/,

    ], // 设置 jwt 认证白名单
});

module.exports = jwtAuth;
