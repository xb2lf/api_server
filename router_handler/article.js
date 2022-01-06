const db = require('../db/index');
const path = require('path');

exports.addArticle = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...res.body,
    //文章是哪个封面在服务器端的存放路径
    cover: path.join('/uploads', req.file.filename),
    //文章发布时间
    pub_date: new Date(),
    //文章作者的Id
    author_id: req.user.id
  };
  const sql = 'insert into ev_articles set ?';
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('发布文章失败')
    res.css('发布文章成功', 0)
  })
}