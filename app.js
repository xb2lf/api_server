const express = require('express');
const cors = require('cors');
const joi = require('joi');
const app = express();
const expressJWT = require('express-jwt');
const userRouter = require('./router/user');
const userinfoRouter = require('./router/userinfo');
//导入全局的配置文件
const config = require('./config');

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

//一定要在路由之前配置解析token的中间件
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'], credentialsRequired: true }).unless({ path: [/^\/api\//] }))

app.use('/api', userRouter);
app.use('/my', userinfoRouter)

//全局错误中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
  res.cc('未知错误')
})

app.listen(3007, () => {
  console.log('api server is running at http://127.0.0.1:3007')
})