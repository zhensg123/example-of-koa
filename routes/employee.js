const router = require('koa-router')({prefix: '/employee'})

const employeeService = require('../services/employee');
const Result = require('../models/Result')
const seq = require('sequelize');

const Op = seq.Op;
/**
 * @swagger
 *  /employee/findAll:
 *    get:
 *      tags:
 *        - employee
 *      parameters:
 *        - name: pageSize
 *          description: 页数
 *        - name: pageIndex
 *          description: 页码
 *        - name: keyword
 *          description: 搜索关键词
 *      responses:
 *        200:
 *          description: 查询结果
 */
router.get('/findAll', async function(ctx) {
   const {pageSize = 10, pageIndex = 1, keyword=''} = ctx.request.query

   const employee = await employeeService.findData({
      ename: {
         [Op.like]: `%${keyword}%`
     },
   }, {
      size: parseInt(pageSize),
      page: parseInt(pageIndex)
   })
   if (employee) {
      new Result(employee, '获取成功', 'success').success(ctx)
   } else {
      new Result(null, '获取失败', 'fail').fail(ctx)
   }
});

router.post('/add', async function(ctx) {
   const employee = await employeeService.add(ctx.request.body)
   new Result(employee, '新增成功', 'success').success(ctx)

});

router.post('/update', async function(ctx) {
   const {eno, ename, salary, dname, hiredate  } = ctx.request.body
   const employee = await employeeService.update(eno, {
      ename,
     salary,
     dname,
     hiredate
   })
   new Result(null, '更新成功', 'success').success(ctx)
});

router.delete('/del', async function(ctx) {
   const id = ctx.request.query.id;
   await employeeService.delete(id)
   new Result(null, '删除成功', 'success').success(ctx)
});

module.exports = router;