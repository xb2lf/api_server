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
  const sql = 'select * from ev_users where username=?';
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) return res.cc('用户名被占用，请更换其他用户名！');
  })
  // 调用bcrypt.hashSync()对密码进行加密
  userinfo.password = bcrypt.hashSync(userinfo.password, 10);
  const insert_sql = 'insert into ev_users set ?';
  db.query(insert_sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
    if (err) return res.cc(err)
    // 判断影响行数是否为1
    if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试')
    // 注册成功
    res.cc('注册用户成功', 0)
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  res.send('login ok')
}