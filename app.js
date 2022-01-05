const express = require('express');
const cors = require('cors');
const joi = require('joi');
const app = express();
const userRouter = require('./router/user');

app.use(cors())

// app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//用来统一处理错误，封装res.cc函数
app.use((req, res, next) => {
  // status=0为成功,status=1为失败，默认将status的值设置为1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      // 状态描述，判断err是错误对象还是字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

app.use('/api', userRouter);

//全局错误中间件
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err)
  res.cc('未知错误')
})

app.listen(3007, () => {
  console.log('api server is running at http://127.0.0.1:3007')
})