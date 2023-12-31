
const Result = require('../models/Result')
const router = require('koa-router')({prefix: '/user'})

const {
    md5,
    decode
} = require('../utils/index')
const {
    PWD_SALT,
    PRIVATE_KEY,
    JWT_EXPIRED
} = require('../utils/code-status')
const userService = require('../services/users')

// const boom = require('boom')
const jwt = require('jsonwebtoken')

/**
 * @swagger
 *  /user/login:
 *    post:
 *      tags:
 *        - user
 *      summary: 用户登录接口
 *      description: 访问权限：admin teacher student 游客
 *      parameters:
 *        - name: username
 *          description: 用户名
 *          required: true
 *        - name: password
 *          description: 密码
 *          required: true
 *      responses:
 *        200:
 *          description: 返回token
 */
router.post('/login', async function (ctx) {
        const username = ctx.request.body.username
        const password = md5(`${ctx.request.body.password}${PWD_SALT}`)
        const user = await userService.login(username, password)
        if (!user) {
            new Result(null, '登录失败', 'login failed').fail(ctx)
        } else {
            // const userId = user.id
            const session = {
                userId: user.id,
                username: user.username,
                password: user.password
            }
            const token = jwt.sign(session,
                PRIVATE_KEY, {
                    expiresIn: JWT_EXPIRED
                }
            )
            new Result({
                token
            }, '登录成功', 'success').success(ctx)
        }
    });

    router.post('/register', async function (ctx) {
    
        const obj = {
            username: ctx.request.body.username,
            password: md5(`${ctx.request.body.password}${PWD_SALT}`)
        }
        const user = await userService.addUser(obj)
        const session = {
            userId: user.id,
            username: user.username,
            password: user.password,
        };
        const token = jwt.sign(session, PRIVATE_KEY, {
            expiresIn: JWT_EXPIRED,
        });

        new Result({
            token
        }, '注册成功', 'success').success(ctx)
    });




// /**
//  * @swagger
//  *  /user/delete/:id:
//  *    delete:
//  *      tags:
//  *        - user
//  *      summary: 删除用户
//  *      description: 访问权限：admin 
//  *      parameters:
//  *        - name: id
//  *          description: 用户id
//  *      responses:
//  *        200:
//  *          description: 删除成功
//  */
// router.delete('/delete/:id', async function (ctx) {

//     const id = ctx.req.params.id;
//     await userService.deleteUser(id)
//     new Result(null, '删除成功', 'success').success(ctx)
// });

// /**
//  * @swagger
//  *  /user/add:
//  *    post:
//  *      tags:
//  *        - user
//  *      summary: 添加用户
//  *      description: 访问权限：admin 
//  *      parameters:
//  *        - name: username
//  *          description: 用户名
//  *        - name: password
//  *          description: 密码
//  *        - name: roles
//  *          description: 角色，多个角色用;分隔。包括 student, teacher, parents, subadmin, admin
//  *        - name: firstName
//  *          description: 姓
//  *        - name: lastName
//  *          description: 名
//  *        - name: experience
//  *          description: 经验
//  *        - name: phone
//  *          description: 用户手机号
//  *      responses:
//  *        200:
//  *          description: 添加成功
//  */
// router.post('/add', async function (ctx) {


//     const obj = {
//         username: req.body.username,
//         password: md5(`${req.body.password}${PWD_SALT}`),
//         roles: req.body.roles,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         experience: req.body.experience,
//         phone: req.body.phone
//     }
//     const user = await userService.addUser(obj)
//     new Result(user, '新增成功', 'success').success(res)
// });

// /**
//  * @swagger
//  *  /user/update/:id:
//  *    put:
//  *      tags:
//  *        - user
//  *      summary: 更新用户
//  *      description: 访问权限：admin teacher student
//  *      parameters:
//  *        - name: id
//  *          description: 用户id
//  *        - name: roles
//  *          description: 用户角色
//  *        - name: firstName
//  *          description: firstName
//  *        - name: lastName
//  *          description: lastName
//  *        - name: experience
//  *          description: 用户经验
//  *        - name: password
//  *          description: 用户密码
//  *        - name: phone
//  *          description: 用户手机号
//  *      responses:
//  *        200:
//  *          description: 更新用户信息成功
//  */
// router.put('/update/:id', async function (res) {
//     // TODO 管理员和普通用户更新接口需要分开
//     // if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
//     //     return
//     // }

//     const id = req.params.id;
//     const roles = req.body.roles
//     const firstName = req.body.firstName
//     const lastName = req.body.lastName
//     const experience = req.body.experience

//     let obj = {
//         roles: roles,
//         firstName: firstName,
//         lastName: lastName,
//         experience: experience
//     }
//     if (req.body.password) {
//         obj.password = md5(`${req.body.password}${PWD_SALT}`)
//     }
//     if (req.body.phone) {
//         obj.phone = req.body.phone,
//             obj.phoneVerify = 1
//     }

//     await userService.updateUser(id, obj)
//     new Result(null, '更新成功', 'success').success(res)
// });

// /**
//  * @swagger
//  *  /user/sms_verify:
//  *    post:
//  *      tags:
//  *        - user
//  *      summary: 登录验证码校验
//  *      description: 访问权限：公开访问
//  *      parameters:
//  *        - name: phone
//  *          description: 11位手机号
//  *        - name: code
//  *          description: 短信校验码
//  *      responses:
//  *        200:
//  *          description: 返回校验结果
//  */
// router.post('/sms_verify', async function (res) {
//     const phone = req.body.phone || ''
//     const code = req.body.code || ''
//     if (!phone) {
//         new Result(null, 'phone不能为空', 'phone is blank').fail(res);
//         return
//     }
//     if (!code) {
//         new Result(null, 'code不能为空', 'code is blank').fail(res);
//         return
//     }

//     var key = SMS_TYPE_LOGIN + ":" + phone
//     var value = myCache.get(key);
//     if (value && code == value) {
//         myCache.del(key)

//         const rows = await userService.findUserByPhone(phone)
//         if (rows && rows.length >= 1) {
//             var user = rows[0]
//             const session = {
//                 userId: user.id,
//                 roles: user.roles,
//                 username: user.username,
//                 firstName: user.firstName
//             }
//             const token = jwt.sign(session,
//                 PRIVATE_KEY, {
//                     expiresIn: JWT_EXPIRED
//                 }
//             )
//             new Result({
//                 token
//             }, '登录成功', 'success').success(res)
//         } else {
//             new Result(null, '用户不存在', 'user not found').fail(res);
//         }
//     } else {
//         new Result(null, '验证失败', 'verify fail').fail(res);
//     }

// });

// router.post('/sms_register_verify', async function (res) {
//     const phone = req.body.phone || ''
//     const code = req.body.code || ''
//     if (!phone) {
//         new Result(null, 'phone不能为空', 'phone is blank').fail(res);
//         return
//     }
//     if (!code) {
//         new Result(null, 'code不能为空', 'code is blank').fail(res);
//         return
//     }

//     var key = SMS_TYPE_LOGIN + ":" + phone
//     var value = myCache.get(key);
//     if (value && code == value) {
//         myCache.del(key)
//         const rows = await userService.findUserByPhone(phone)
//         if (rows && rows.length >= 1) {
//             new Result(null, '验证成功', 'success').success(res)
//         } else {
//             new Result(null, '手机号已注册请直接登录', 'registered').fail(res);
//         }
//     } else {
//         new Result(null, '验证失败', 'verify fail').fail(res);
//     }

// });

// /**
//  * @swagger
//  *  /user/bind_phone:
//  *    post:
//  *      tags:
//  *        - user
//  *      summary: 绑定手机号
//  *      description: 访问权限：admin teacher student
//  *      parameters:
//  *        - name: phone
//  *          description: 11位手机号
//  *        - name: code
//  *          description: 短信校验码
//  *      responses:
//  *        200:
//  *          description: 返回绑定结果
//  */
// router.post('/bind_phone', async function (res) {
//     const phone = req.body.phone || ''
//     const code = req.body.code || ''
//     if (!phone) {
//         new Result(null, 'phone不能为空', 'phone is blank').fail(res);
//         return
//     }
//     if (!code) {
//         new Result(null, 'code不能为空', 'code is blank').fail(res);
//         return
//     }

//     var key = SMS_TYPE_BINDPHONE + ":" + phone
//     var value = myCache.get(key);
//     if (value && code == value) {
//         myCache.del(key)

//         const rows = await userService.findUserByPhone(phone)
//         if (rows && rows.length >= 1) {
//             new Result(null, '手机号已经被绑定', 'bound phone number').fail(res)
//             return
//         }
//         const user = req.user;
//         await userService.updateUser(user.userId, {
//             phone: phone,
//             phoneVerify: 1
//         })
//         new Result(null, '绑定成功', 'success').success(res)
//     } else {
//         new Result(null, '绑定失败', 'bind fail').fail(res);
//     }

// });

module.exports = router
