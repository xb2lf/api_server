const db = require('../db/index');
//导入用户密码加密模块
const bcrypt = require('bcryptjs');

//获取用户基本信息
exports.getUserInfo = (req, res) => {
  const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?';
  // 注意：req对象上的user属性,是Token解析成功，express-jwt挂载上去的
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    //获取用户信息成功
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: results[0]
    })
  })
}

//更新用户基本信息
exports.updateUserInfo = (req, res) => {
  const sql = 'update ev_users set ? where id=?';
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新用户的基本信息失败')
    res.cc('更新用户的基本信息成功', 0)
  })
}

//修改用户密码
exports.updatePassword = (req, res) => {
  const sql = 'select * from ev_users where id=?';
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在')
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
    if (!compareResult) return res.cc('旧密码错误');
    const update_sql = 'update ev_users set password=? where id=?';
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(update_sql, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新密码失败')
      res.cc('更新密码成功', 0)
    })
  })
}

//更新用户头像
exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set user_pic=? where id=?';
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更换头像失败')
    res.cc('更换头像成功', 0)
  })
}