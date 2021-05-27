require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';
import createFakeData from './createFakeData';
import jwtMiddleware from './lib/jwtMiddleware';
import { create } from 'eslint/lib/rules/*';
// lib/jwtMiddleare 미들웨어를 적용한다 

//비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const {PORT, MONGO_URI} = process.env;

mongoose.connect(MONGO_URI, {useUnifiedTopology: true, useFindAndModify: false})
    .then(() => {
        console.log('Connected to MongoDB');
        //createFakeData();
    })
    .catch(e => {
        console.error(e);
    });

const app = new Koa();
const router = new Router();

//라우터 설정
router.use('/api', api.routes()); //api 라우트 적용

//라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

//POST가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
    //서버를 port 4000으로 열고 서버에 접속하면 hello world 반환함
    //서버를 종료할 때는 ctrl + c를 누른다 시작할 땐 node src
    console.log('Listening to port %d', port);
});//index.js가 해당 디렉터리(src)를 대표하는 파일이다.