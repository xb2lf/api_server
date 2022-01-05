const express = require('express');
const expressJoi = require('@escook/express-joi');
const router = express.Router();

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user');

// 打入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

//注册新用户
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser);

//登录

router.post('/login', expressJoi(reg_login_schema), userHandler.login);

// 将路由对象共享出去
module.exports = router;