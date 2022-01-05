/**
 * 在这里定义和用户相关的路由处理函数，供/router/user.js模块调用
 */
const db = require('../db/index');
//导入用户密码加密模块
const bcrypt = require('bcryptjs');

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交的用户信息
  const userinfo = req.body;

  // 对表单中的数据，进行合法性的校验
  if (!userinfo.username || !userinfo.password) {
    return res.send({ status: 1, message: '用户或密码不能为空！' })
  }
  const sql = 'select * from ev_users where username=?';
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.send({ status: 1, message: err.message });
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '用户名被占用，请更换其他用户名！'
      })
    }
  })
  // 调用bcrypt.hashSync()对密码进行加密
  userinfo.password = bcrypt.hashSync(userinfo.password, 10);
  const insert_sql = 'insert into ev_users set ?';
  db.query(insert_sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    // 判断影响行数是否为1
    if (results.affectedRows !== 1) return res.send({ status: 1, message: '注册用户失败，请稍后再试' })
    // 注册成功
    res.send({ status: 0, message: '注册用户成功' })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  res.send('login ok')
}