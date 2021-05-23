import Router from 'koa-router';
import posts from './posts';
import user from './user';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/user', user.routes());

//라우터를 내보낸다
export default api;